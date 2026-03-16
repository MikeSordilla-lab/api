#!/usr/bin/env python3
"""
Test runner for Student App backend tests
Runs all TC*.py test files and reports results
"""

import os
import sys
import subprocess
from pathlib import Path

def run_test(test_file):
    """Run a single test file and return result"""
    try:
        result = subprocess.run(
            [sys.executable, str(test_file)],
            capture_output=True,
            text=True,
            timeout=60
        )
        return {
            'file': test_file.name,
            'success': result.returncode == 0,
            'output': result.stdout,
            'error': result.stderr,
            'returncode': result.returncode
        }
    except subprocess.TimeoutExpired:
        return {
            'file': test_file.name,
            'success': False,
            'output': '',
            'error': 'Test timed out',
            'returncode': -1
        }
    except Exception as e:
        return {
            'file': test_file.name,
            'success': False,
            'output': '',
            'error': str(e),
            'returncode': -1
        }

def main():
    test_dir = Path(__file__).parent
    test_files = sorted(test_dir.glob('TC*.py'))
    
    if not test_files:
        print("❌ No test files found")
        return 1
    
    print(f"🧪 Running {len(test_files)} tests from {test_dir}\n")
    print("=" * 70)
    
    results = []
    for test_file in test_files:
        print(f"Running {test_file.name}...", end=' ', flush=True)
        result = run_test(test_file)
        results.append(result)
        
        if result['success']:
            print("✅ PASS")
        else:
            print("❌ FAIL")
            if result['error']:
                print(f"   Error: {result['error'][:100]}")

    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    
    passed = sum(1 for r in results if r['success'])
    failed = sum(1 for r in results if not r['success'])
    
    for result in results:
        status = "✅ PASS" if result['success'] else "❌ FAIL"
        print(f"{status} - {result['file']}")
        if not result['success'] and result['error']:
            # Print first 500 chars of error
            error_preview = result['error'][:500]
            print(f"     Error: {error_preview}")
    
    print("\n" + "=" * 70)
    print(f"Results: {passed} passed, {failed} failed out of {len(results)} tests")
    print(f"Success Rate: {passed}/{len(results)} ({int(passed*100/len(results))}%)")
    print("=" * 70)
    
    return 0 if failed == 0 else 1

if __name__ == '__main__':
    sys.exit(main())
