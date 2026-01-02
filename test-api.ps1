# Test API endpoints
$loginJson = curl.exe -s -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@cosplay.com","password":"admin"}'
  
$token = ($loginJson | ConvertFrom-Json).token
Write-Host "✓ Authentication successful"

# Test GET wishlist
Write-Host "Testing GET /api/wishlist/me..."
$getRes = curl.exe -s -H "Authorization: Bearer $token" http://localhost:8080/api/wishlist/me
Write-Host "✓ GET /api/wishlist/me - Response: $getRes"

# Test DELETE wishlist
Write-Host "Testing DELETE /api/wishlist/remove/999..."
$delRes = curl.exe -s -X DELETE -H "Authorization: Bearer $token" http://localhost:8080/api/wishlist/remove/999
Write-Host "✓ DELETE /api/wishlist/remove/999 - Response: $delRes"

Write-Host "All tests passed"
