基于JWT的跨域认证（实现一次登录就不用再输入密码的功能）

# 简单概念介绍：  
session生于服务器且保存与服务器端，cookie是一种数据载体保存于客户端。  
token生于服务器但保存于客户端，是服务器产生的一串字符串。  
JWT是一种特殊的token，包含了用户信息且经过签名。

# 1. session认证
## 流程
- 用户向服务器发送用户名和密码。
- 服务器验证通过后，在当前对话 (session) 里面保存相关数据，比如 用户角色 登录时间 等。
- 服务器向用户返回一个 session id，写入用户的 Cookie。
- 用户随后的每一次请求，都会携带 Cookie，将 session id 传回服务器,
- 服务器收到 session id，找到前期保存的数据，由此得知用户的身份。
示意图：
```
客户端                             服务器
  |    ---POST用户名/密码-->         |
  |    <--- HTTP 200 OK----         |
  |    <-- cookie (session id...)   |
  |                                 |
  |    --- get / cookie--->         |
  |    <--- HTTP 200 OK ----        |
 ...                               ...
```
## 问题
当前企业使用集群模式，cookie传入不同的服务器时，session数据无法共享，或者，无法实现跨域认证。

解决方案：
1. 所有session数据存储在一个共享的数据库中，比如redis，但是工程量大。
2. 不再存到服务器，而是存到客户端，这就是token。

# 2. token认证
## 流程
- 客户端使用用户名跟密码请求登录，服务端收到请求，去验证用户名与密码 
- 验证成功后，服务端会签发一个 token 并把这个 token 发送给客户端
- 客户端收到 token 以后，会把它存储起来，比如放在 cookie 里或者localStorage 里 
- 客户端每次向服务端请求资源的时候需要带着服务端签发的 token
- 服务端收到请求，然后去验证客户端请求里面带着的 token，如果验证成功就向客户端返回请求的数据

## 特点
- token 是无状态的，服务端不需要存储 session 信息，减轻了服务器的压力；  
用解析 token 的计算**时间换取 session 的存储空间**，减少频繁的查询数据库。
- token由客户端保存。跨域请求时，服务端只需要验证 token 的合法性即可，解决了跨域认证的问题。

# 3. JWT认证（实现token认证）
jwt：JSON Web Token，目前最流行的跨域认证解决方案。

## 流程
- 客户端使用用户名跟密码请求登录，服务端收到请求，去验证用户名与密码
- 验证成功后，服务端会根据用户信息生成一个 `json对象`，为了防止篡改，服务端会对这个对象进行签名，生成 `JWT`，返回给客户端
- 客户端收到 JWT 以后，会把它存储起来，比如放在 `cookie` 里或者 `localStorage` 里（存到`cookie默认不能跨域`）
- 客户端每次向服务端请求资源的时候需要带着服务端签发的 `JWT`
- 服务端收到请求，然后去验证客户端请求里面带着的 `JWT`，如果验证成功就向客户端返回请求的数据

## 结构
JWT由三部分组成：头部（`Header`）、载荷（`Payload`，也就是携带的数据）、签名（`Signature`），三部分之间用点（.）连接，最后用`base64url`编码。如：
`xxxxx.yyyyy.zzzzz`。注意：JWT**本身不加密，只是编码**，只是如果修改了会被察觉，所以**不要存敏感信息**。
- Header：头部，主要包含两部分信息：
    - 令牌的类型（`typ`），通常是JWT；
    - 所使用的签名算法（`alg`），默认是HMAC SHA256 (`HS256`)。
- Payload：jwt提供了7个字段：  
  - iss (issuer):签发人
  - exp(expiration time):过期时间
  - sub(subject):主题
  - aud(audience):受众 
  - nbf(Not Before):生效时间
  - iat (lssued At):签发时间
  - jti (WTID):编号
- Signature：签名，为了防止数据被篡改。签名是通过将编码后的header和payload与一个密钥（`secret`）以及所使用的签名算法组合在一起生成的。

## 生成token

```java
//7天过期
private static long expire =604800;
//32位秘钥
private static string secret ="abcdfghiabcdfghiabcdfghiabcdf
//生成token
public static String createToken(String userId) {
    Date now = new Date();
    Date expireDate = new Date(now.getTime() + expire * 1000); // 默认是毫秒，所以要乘以1000
    return Jwts.builder()
            .setHeaderParam("typ", "JWT")
            .setSubject(userId)
            .setIssuedAt(now)
            .setExpiration(expireDate)
            .signWith(SignatureAlgorithm.HS256, secret)
            .compact();
}
```

## 解析token

```java
//解析token拿到jwt的body部分，可以继续getSubject()等方法拿到对应字段
public static Claims parseToken(String token) {
    return Jwts.parser()
            .setSigningKey(secret)
            .parseClaimsJws(token)
            .getBody();
}
```

## 具体到后端项目中实现
比如当前项目有个controller，里面有 `登录` 和 `查看` 两种方法，
首先登录，用户输入用户名和密码，验证成功后生成token包装到Result工具类，返回给前端；

```java
import util.Result; //假装有个工具类包装结果
@RestController
@RequestMapping("/user")
public class UserController {
  @PostMapping("/login")
  public String login(@RequestBody String userId, @RequestBody String password) {
    // 验证用户名和密码
    if (isValidUser(username, password)) {
      // 生成JWT
      String token = createToken(userId);
      return Result.ok.data("token", token);
    } else {
      throw new RuntimeException("Invalid username or password");
    }
  }
  // 查看方法，前端每次请求都带上token，后端解析token拿到用户信息，验证成功后返回数据。
  @GetMapping("/profile")
  public String getProfile(String token) {
    try {
      String username = parseToken(token).getSubject();
      return Result.ok.data("userId", userId);
    } catch (Exception e) {
      throw new RuntimeException("Invalid token");
    }
  }
}
```
util包下的Result工具类：
```java
public class Result {
    private boolean success;
    private String message;
    private Map<String, Object> data = new HashMap<>();
    public static Result ok() {
        Result result = new Result();
        result.setSuccess(true);
        result.setMessage("Success");
        return result;
    }
    public static Result error() {
        Result result = new Result();
        result.setSuccess(false);
        result.setMessage("Error");
        return result;
    }
    public Result data(String key, Object value) {
        this.data.put(key, value);
        return this;
    }
    // 省略getter和setter方法
}
```