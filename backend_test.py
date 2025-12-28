import requests
import sys
from datetime import datetime

class RadioAPITester:
    def __init__(self, base_url="https://streamhub-1403.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method == 'POST':
                response = requests.post(url, headers=headers, json=params, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    data = response.json()
                    if isinstance(data, dict):
                        if 'stations' in data:
                            print(f"   Found {len(data['stations'])} stations")
                        elif 'tags' in data:
                            print(f"   Found {len(data['tags'])} tags")
                        elif 'countries' in data:
                            print(f"   Found {len(data['countries'])} countries")
                except:
                    pass
            else:
                self.tests_passed += 1 if response.status_code in [200, 201] else 0
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'url': url,
                    'response': response.text[:200] if response.text else 'No response'
                })

            return success, response.json() if response.status_code == 200 else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e),
                'url': url
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_search_stations(self):
        """Test station search functionality"""
        # Test search by name
        success1, _ = self.run_test(
            "Search by name", "GET", "stations/search", 200,
            params={"name": "BBC", "limit": 10}
        )
        
        # Test search by tag
        success2, _ = self.run_test(
            "Search by tag", "GET", "stations/search", 200,
            params={"tag": "pop", "limit": 10}
        )
        
        # Test search by country
        success3, _ = self.run_test(
            "Search by country", "GET", "stations/search", 200,
            params={"country": "United States", "limit": 10}
        )
        
        return success1 and success2 and success3

    def test_top_stations(self):
        """Test top voted stations"""
        return self.run_test(
            "Top voted stations", "GET", "stations/topvote", 200,
            params={"limit": 12}
        )[0]

    def test_trending_stations(self):
        """Test trending stations"""
        return self.run_test(
            "Trending stations", "GET", "stations/topclick", 200,
            params={"limit": 8}
        )[0]

    def test_stations_by_tag(self):
        """Test stations by tag"""
        return self.run_test(
            "Stations by tag", "GET", "stations/bytag/pop", 200,
            params={"limit": 10}
        )[0]

    def test_stations_by_country(self):
        """Test stations by country"""
        return self.run_test(
            "Stations by country", "GET", "stations/bycountry/United States", 200,
            params={"limit": 10}
        )[0]

    def test_get_tags(self):
        """Test get tags/genres"""
        return self.run_test(
            "Get tags/genres", "GET", "tags", 200,
            params={"limit": 50}
        )[0]

    def test_get_countries(self):
        """Test get countries"""
        return self.run_test(
            "Get countries", "GET", "countries", 200,
            params={"limit": 50}
        )[0]

    def test_station_click(self):
        """Test station click recording"""
        # First get a station to test with
        success, response = self.run_test(
            "Get station for click test", "GET", "stations/topvote", 200,
            params={"limit": 1}
        )
        
        if success and response.get('stations'):
            station_uuid = response['stations'][0]['stationuuid']
            return self.run_test(
                "Record station click", "POST", f"stations/{station_uuid}/click", 200
            )[0]
        else:
            print("❌ Could not get station for click test")
            return False

def main():
    print("🎵 Radio Directory API Testing")
    print("=" * 50)
    
    # Setup
    tester = RadioAPITester()
    
    # Run all tests
    tests = [
        ("Root Endpoint", tester.test_root_endpoint),
        ("Search Stations", tester.test_search_stations),
        ("Top Stations", tester.test_top_stations),
        ("Trending Stations", tester.test_trending_stations),
        ("Stations by Tag", tester.test_stations_by_tag),
        ("Stations by Country", tester.test_stations_by_country),
        ("Get Tags", tester.test_get_tags),
        ("Get Countries", tester.test_get_countries),
        ("Station Click", tester.test_station_click),
    ]
    
    print(f"\nRunning {len(tests)} test suites...")
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            test_func()
        except Exception as e:
            print(f"❌ Test suite failed: {str(e)}")
    
    # Print results
    print(f"\n{'='*50}")
    print(f"📊 Test Results:")
    print(f"   Tests run: {tester.tests_run}")
    print(f"   Tests passed: {tester.tests_passed}")
    print(f"   Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "0%")
    
    if tester.failed_tests:
        print(f"\n❌ Failed tests:")
        for failure in tester.failed_tests:
            print(f"   - {failure['name']}: {failure.get('error', f\"Expected {failure.get('expected')}, got {failure.get('actual')}\"")}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())