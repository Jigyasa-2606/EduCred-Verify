# backend/test_forgery.py
import sys
import os

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.forgery_detection import detect_forgery

def test_forgery_detection():
    # Get the absolute path to the test certificates folder
    current_dir = os.path.dirname(os.path.abspath(__file__))
    test_certificates_dir = os.path.join(current_dir, "test_certificates")
    
    # Test with different certificates
    test_cases = [
        {
            "certificate_path": os.path.join(test_certificates_dir, "RTI_Certificate.png"),
            "ocr_data": {"institution": "Ranchi Tech Institute", "name": "Deepak Yadav"}
        },
        {
            "certificate_path": os.path.join(test_certificates_dir, "JSU_Certificate.png"), 
            "ocr_data": {"institution": "Jharkhand State University", "name": "Rajesh Kumar"}
        },
        {
            "certificate_path": os.path.join(test_certificates_dir, "JBS_Certificate.png"),
            "ocr_data": {"institution": "Jharkhand Business School", "name": "Amit Verma"}
        }
    ]
    
    for test_case in test_cases:
        try:
            print(f"\nTesting: {test_case['ocr_data']['institution']}")
            print(f"Certificate: {test_case['certificate_path']}")
            
            # Check if file exists first
            if not os.path.exists(test_case['certificate_path']):
                print(f"❌ File not found: {test_case['certificate_path']}")
                continue
            
            results = detect_forgery(test_case['certificate_path'], test_case['ocr_data'])
            
            print("✅ Forgery Detection Results:")
            print(f"   Institution: {results['institution']} ({results['institution_code']})")
            print(f"   Seal Match Score: {results['seal_match_score']:.3f}")
            print(f"   Signature Match Score: {results['signature_match_score']:.3f}")
            print(f"   Seal Authentic: {results['seal_authentic']}")
            print(f"   Signature Authentic: {results['signature_authentic']}")
            print(f"   Overall Authentic: {results['overall_authentic']}")
            print("-" * 50)
            
        except Exception as e:
            print(f"❌ Error testing {test_case['certificate_path']}: {e}")

if __name__ == "__main__":
    test_forgery_detection()