# backend/app/forgery_detection.py
import cv2
import numpy as np
from .database import get_institution_assets
from .config import INSTITUTION_CONFIG, INSTITUTION_NAME_TO_CODE, OCR_INSTITUTION_MAPPING
import os

def extract_roi(image, roi_ratio):
    """
    Extracts a region from an image based on ratio coordinates.
    roi_ratio: [x_start, y_start, x_end, y_end] as ratios (0 to 1)
    """
    height, width = image.shape[:2]
    x_start = int(roi_ratio[0] * width)
    y_start = int(roi_ratio[1] * height)
    x_end = int(roi_ratio[2] * width)
    y_end = int(roi_ratio[3] * height)
    return image[y_start:y_end, x_start:x_end]

def get_institution_code_from_ocr(ocr_institution_name):
    """
    Convert OCR-extracted institution name to standardized code
    """
    # Clean and normalize the OCR text
    cleaned_name = ocr_institution_name.lower().strip()
    
    # Map to standard name
    standard_name = OCR_INSTITUTION_MAPPING.get(cleaned_name, cleaned_name)
    
    # Convert to institution code
    return INSTITUTION_NAME_TO_CODE.get(standard_name)

def verify_seal(extracted_seal, reference_seal):
    """
    Compare extracted seal with reference seal using ORB feature matching
    Returns: match_score (0.0 to 1.0)
    """
    # Ensure both images are grayscale
    if len(extracted_seal.shape) == 3:
        extracted_seal = cv2.cvtColor(extracted_seal, cv2.COLOR_BGR2GRAY)
    if len(reference_seal.shape) == 3:
        reference_seal = cv2.cvtColor(reference_seal, cv2.COLOR_BGR2GRAY)
    
    # Initialize ORB detector
    orb = cv2.ORB_create()
    
    # Find keypoints and descriptors
    kp1, des1 = orb.detectAndCompute(extracted_seal, None)
    kp2, des2 = orb.detectAndCompute(reference_seal, None)
    
    # Check if we have enough features to compare
    if des1 is None or des2 is None or len(des1) < 2 or len(des2) < 2:
        return 0.0
    
    # Match features
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(des1, des2)
    
    # Calculate match score
    if len(matches) > 10:
        match_score = len(matches) / min(len(des1), len(des2))
        return min(match_score, 1.0)  # Cap at 1.0
    return 0.0

def verify_signature(extracted_signature, reference_signature):
    """
    Verify signature using template matching (better for signatures)
    Returns: match_score (0.0 to 1.0)
    """
    # Convert to grayscale if needed
    if len(extracted_signature.shape) == 3:
        extracted_gray = cv2.cvtColor(extracted_signature, cv2.COLOR_BGR2GRAY)
    else:
        extracted_gray = extracted_signature
    
    if len(reference_signature.shape) == 3:
        reference_gray = cv2.cvtColor(reference_signature, cv2.COLOR_BGR2GRAY)
    else:
        reference_gray = reference_signature
    
    # Resize reference to match extracted signature size
    ref_resized = cv2.resize(reference_gray, (extracted_gray.shape[1], extracted_gray.shape[0]))
    
    # Use template matching
    result = cv2.matchTemplate(extracted_gray, ref_resized, cv2.TM_CCOEFF_NORMED)
    _, max_val, _, _ = cv2.minMaxLoc(result)
    
    return max_val

def detect_forgery(certificate_path, ocr_data, debug=False):
    """
    Main function to detect forgery in a certificate using OCR data
    """
    # Load the certificate image
    cert_img = cv2.imread(certificate_path)
    if cert_img is None:
        raise ValueError(f"Certificate image not found at: {certificate_path}")
    
    # Get institution code from OCR data
    institution_name = ocr_data.get('institution', '')
    institution_code = get_institution_code_from_ocr(institution_name)
    
    if not institution_code:
        raise ValueError(f"Could not determine institution code from: {institution_name}")
    
    # Get institution configuration
    config = INSTITUTION_CONFIG.get(institution_code)
    if not config:
        raise ValueError(f"No configuration found for institution: {institution_code}")
    
    # Get reference assets from database
    assets = get_institution_assets(institution_code)
    if not assets:
        raise ValueError(f"No assets found for institution: {institution_code}")
    
    # Construct full paths to reference images
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    ref_seal_path = os.path.join(base_dir, assets['seal_path'])
    ref_signature_path = os.path.join(base_dir, assets['signature_path'])
    
    if debug:
        print(f"DEBUG: BASE_DIR = {base_dir}")
        print(f"DEBUG: Database seal path = {assets['seal_path']}")
        print(f"DEBUG: Full seal path = {ref_seal_path}")
        print(f"DEBUG: Seal exists = {os.path.exists(ref_seal_path)}")

    # Load reference images
    ref_seal = cv2.imread(ref_seal_path)
    ref_signature = cv2.imread(ref_signature_path)
    
    if ref_seal is None:
        raise ValueError(f"Reference seal not found at: {ref_seal_path}")
    if ref_signature is None:
        raise ValueError(f"Reference signature not found at: {ref_signature_path}")

    # Extract regions from certificate using configured ROIs
    seal_region = extract_roi(cert_img, config['seal']['roi'])
    signature_region = extract_roi(cert_img, config['signature']['roi'])
    
    # Save extracted regions for debugging
    if debug:
        cv2.imwrite(f"extracted_seal_{institution_code}.jpg", seal_region)
        cv2.imwrite(f"extracted_signature_{institution_code}.jpg", signature_region)
        cv2.imwrite(f"reference_seal_{institution_code}.jpg", ref_seal)
        cv2.imwrite(f"reference_signature_{institution_code}.jpg", ref_signature)
    
    # Perform verification
    seal_score = verify_seal(seal_region, ref_seal)
    signature_score = verify_signature(signature_region, ref_signature)
    
    # Use configurable thresholds - lower for testing
    seal_threshold = config['seal'].get('threshold', 0.3)
    signature_threshold = config['signature'].get('threshold', 0.05)
    
    return {
        'institution': institution_name,
        'institution_code': institution_code,
        'seal_match_score': round(seal_score, 3),
        'signature_match_score': round(signature_score, 3),
        'seal_authentic': seal_score >= seal_threshold,
        'signature_authentic': signature_score >= signature_threshold,
        'overall_authentic': seal_score >= seal_threshold and signature_score >= signature_threshold,
        'thresholds': {
            'seal': seal_threshold,
            'signature': signature_threshold
        }
    }