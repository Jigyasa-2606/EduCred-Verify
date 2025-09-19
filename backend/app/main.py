# backend/app/main.py (or a separate service file)
from .database import get_institution_assets
from .utils import get_institution_code_from_name  # Import the new helper
import cv2
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # Points to /backend

def verify_certificate(ocr_data, extracted_seal_image, extracted_signature_image):
    """
    Main verification function using the corrected institution codes
    """
    # 1. Get institution code from OCR text
    institution_name = ocr_data.get('institution')
    institution_code = get_institution_code_from_name(institution_name)
    
    if not institution_code:
        return {"authentic": False, "error": f"Unknown institution: {institution_name}"}
    
    # 2. Get the paths from the database
    assets = get_institution_assets(institution_code)
    if not assets:
        return {"authentic": False, "error": f"Institution assets not found for: {institution_code}"}

    # 3. Construct full paths and load reference images
    ref_seal_path = os.path.join(BASE_DIR, assets['seal_path'])
    ref_signature_path = os.path.join(BASE_DIR, assets['signature_path'])
    
    ref_seal = cv2.imread(ref_seal_path, 0)
    ref_signature = cv2.imread(ref_signature_path, 0)
    
    if ref_seal is None:
        return {"authentic": False, "error": f"Reference seal not found at: {ref_seal_path}"}
    if ref_signature is None:
        return {"authentic": False, "error": f"Reference signature not found at: {ref_signature_path}"}
    
    # 4. Perform the verification checks
    seal_score = verify_seal(extracted_seal_image, ref_seal)
    signature_valid = verify_signature(extracted_signature_image, ref_signature)
    
    # ... [rest of your verification logic] ...
    
    return result