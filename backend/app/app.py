from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from PIL import Image
import pytesseract
import re
from fuzzywuzzy import fuzz
import cv2
import numpy as np
import os
from datetime import datetime
import tempfile

app = Flask(__name__)
CORS(app)

# Load the database
db = pd.read_csv("/Users/jigyasaverma/Desktop/backend/Edu_cred_verify/EduCred-Verify/datasets/ocr_dataset.csv")  # Update with your actual path


def normalize(text):
    """Normalize text for fuzzy matching"""
    return re.sub(r'\s+', ' ', text).strip().upper()


def clean_name(name):
    """Clean extracted name"""
    # Remove common trailing phrases that are not part of name
    name = re.sub(r'\b(PRESENTED.*|For completing.*|In the year.*)$', '', name, flags=re.IGNORECASE)
    # Keep only alphabetic parts
    name = re.sub(r'[^A-Za-z\s]', '', name)
    return name.strip()


def extract_year(text, cert_no=None):
    """Extract year from text"""
    clean_text = text
    if cert_no:
        clean_text = clean_text.replace(cert_no, "")  # remove cert no part

    # Look for year 19xx or 20xx
    match = re.search(r'\b(19|20)\d{2}\b', clean_text)
    if match:
        return match.group(0)
    return None


def extract_certificate_info(img):
    """Extract certificate info including year"""
    text = pytesseract.image_to_string(img)
    info = {}

    # Certificate ID - Multiple patterns
    patterns = [
        r'(JH[-_ ]?UNI[-_ ]?\d{4}[-_ ]?\d+)',
        r'Cert(?:ificate)?\s*No[:\-\s]*([A-Z0-9\-]+)'
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            if 'JH' in pattern:
                info["certificate_no"] = re.sub(r'[\s\-_]+', '-', match.group(1)).upper()
            else:
                info["certificate_no"] = match.group(1).strip()
            break

    if "certificate_no" not in info:
        info["certificate_no"] = "-"

    # Institution
    institutions = [
        'Ranchi Tech Institute',
        'Jharkhand State University',
        'Jharkhand Business School'
    ]

    for institution in institutions:
        if re.search(institution, text, re.IGNORECASE):
            info["institution"] = institution
            break

    # Name + Course block
    match = re.search(r'(?:awarded to|is given to|THIS CERTIFICATE IS GIVEN TO)\s*\n?([A-Za-z\s]+)', text,
                      re.IGNORECASE)
    if match:
        raw_name = re.sub(r'\s+', ' ', match.group(1)).strip()

        # If course is stuck to name, split it
        course_patterns = [r'(BBA|M\.?Sc\s+[A-Za-z]+|BA\s+[A-Za-z]+)', r'(Bachelor.*|Master.*|Diploma.*)']

        for course_pattern in course_patterns:
            course_match = re.search(course_pattern, raw_name, re.IGNORECASE)
            if course_match:
                info["course"] = course_match.group(1).strip()
                raw_name = raw_name.replace(info["course"], "").strip()
                break

        info["name"] = clean_name(raw_name)

    # Year extraction
    year = extract_year(text, info.get("certificate_no"))
    if year:
        info["year"] = year

    # Store raw text for debugging
    info["raw_text"] = text

    return info


def validate_certificate_fuzzy(info, db, threshold=85):
    """Validate certificate using fuzzy matching"""
    best_match = None
    best_scores = {}

    for _, row in db.iterrows():
        scores = {}
        scores['cert'] = fuzz.ratio(normalize(info.get("certificate_no", "")), normalize(str(row["certificate_no"])))
        scores['name'] = fuzz.ratio(normalize(info.get("name", "")), normalize(str(row["name"])))
        scores['inst'] = fuzz.ratio(normalize(info.get("institution", "")), normalize(str(row["institution"])))
        scores['year'] = 100 if info.get("year", "") == str(row["year"]) else 0

        # Calculate overall score
        overall_score = (scores['cert'] * 0.4 + scores['name'] * 0.3 + scores['inst'] * 0.2 + scores['year'] * 0.1)

        # Check if this is a good match
        if (scores['cert'] > threshold and scores['name'] > threshold and
                scores['inst'] > threshold and scores['year'] > 50):

            if best_match is None or overall_score > best_scores.get('overall', 0):
                best_match = row.to_dict()
                best_scores = scores
                best_scores['overall'] = overall_score

    return best_match is not None, best_match, best_scores


def detect_forgery_simple(image_path, institution):
    """Simple forgery detection - you can expand this with your existing code"""
    # Placeholder for forgery detection
    # In real implementation, integrate your forgery_detection.py logic here

    return {
        'institution': institution,
        'institution_code': 'JSU' if 'Jharkhand' in institution else 'RTI',
        'seal_match_score': 0.87,
        'signature_match_score': 0.92,
        'seal_authentic': True,
        'signature_authentic': True,
        'overall_authentic': True,
        'thresholds': {
            'seal': 0.25,
            'signature': 0.05
        }
    }


@app.route('/api/verify-certificate', methods=['POST'])
def verify_certificate():
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'No file uploaded'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'}), 400

        # Validate file type
        allowed_extensions = {'png', 'jpg', 'jpeg', 'tiff'}
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        if file_extension not in allowed_extensions:
            return jsonify({'success': False, 'error': 'Invalid file type'}), 400

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{file_extension}') as temp_file:
            file.save(temp_file.name)
            temp_path = temp_file.name

        try:
            # Load and process image
            img = Image.open(temp_path)

            # Extract information using OCR
            extracted_info = extract_certificate_info(img)

            # Validate against database
            is_valid, matched_record, confidence_scores = validate_certificate_fuzzy(extracted_info, db)

            # Perform forgery detection
            forgery_results = detect_forgery_simple(temp_path, extracted_info.get('institution', ''))

            # Prepare response
            response_data = {
                'success': True,
                'extracted_info': {
                    'certificate_no': matched_record['certificate_no'] if matched_record else extracted_info.get(
                        'certificate_no', 'Not found'),
                    'name': matched_record['name'] if matched_record else extracted_info.get('name', 'Not found'),
                    'institution': matched_record['institution'] if matched_record else extracted_info.get(
                        'institution', 'Not found'),
                    'course': matched_record.get('course', '') if matched_record else extracted_info.get('course',
                                                                                                         'Not found'),
                    'year': str(matched_record['year']) if matched_record else extracted_info.get('year', 'Not found'),
                    'raw_text': extracted_info.get('raw_text', ''),
                    'processing_timestamp': datetime.now().isoformat()
                },
                'validation': {
                    'is_valid': is_valid,
                    'status': 'VERIFIED' if is_valid else 'INVALID',
                    'overall_confidence': int(confidence_scores.get('overall', 0)) if confidence_scores else 0,
                    'confidence_scores': {
                        'ocr_quality': 98,  # You can calculate this based on OCR confidence
                        'name_match': confidence_scores.get('name', 0) if confidence_scores else 0,
                        'institution_match': confidence_scores.get('inst', 0) if confidence_scores else 0,
                        'certificate_format': confidence_scores.get('cert', 0) if confidence_scores else 0,
                        'seal_authentic': forgery_results['seal_authentic'],
                        'signature_authentic': forgery_results['signature_authentic']
                    },
                    'matched_record': matched_record if is_valid else None
                },
                'forgery_detection': forgery_results
            }

            return jsonify(response_data)

        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.unlink(temp_path)

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Certificate verification API is running'})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)