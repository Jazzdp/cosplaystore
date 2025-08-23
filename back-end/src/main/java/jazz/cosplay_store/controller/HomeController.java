package jazz.cosplay_store.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class HomeController {

    @GetMapping
    public String home() {
        return """
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Cosplay Store API</title>
  </head>
  <body style="font-family: Arial, sans-serif; text-align:center; margin-top:40px;">
    <h1>Welcome to the Cosplay Store API 🚀</h1>
    <p>Available endpoints:</p>
    <ul style="list-style:none; padding:0;">
      <li><a href="/users">Users</a></li>
      <li><a href="/products">Products</a></li>
      <li><a href="/orders">Orders</a></li>
      <li><a href="/status">API Status</a></li>
    </ul>
  </body>
</html>
""";
    }

    @GetMapping("/status")
    public String status() {
        return """
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>API Status</title>
  </head>
  <body style="font-family: Arial, sans-serif; text-align:center; margin-top:40px;">
    <h2>Status: OK ✅</h2>
    <p>Timestamp: %s</p>
    <p><a href="/">⬅ Back to Home</a></p>
  </body>
</html>
""".formatted(java.time.LocalDateTime.now());
    }
}
