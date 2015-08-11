# TOC
   - [URL-compatible Base64](#url-compatible-base64)
<a name=""></a>
 
<a name="url-compatible-base64"></a>
# URL-compatible Base64
should encode and decode a string using Base64 URL encoding.

```js
base64UrlTests( '' , '' ) ;
base64UrlTests( 'Hello world' , 'SGVsbG8gd29ybGQ' ) ;
base64UrlTests( 'Hello world!' , 'SGVsbG8gd29ybGQh' ) ;
base64UrlTests( 'Hello world!!' , 'SGVsbG8gd29ybGQhIQ' ) ;
base64UrlTests( 'Hello world!!!' , 'SGVsbG8gd29ybGQhISE' ) ;
base64UrlTests( 'Hello world!!!!' , 'SGVsbG8gd29ybGQhISEh' ) ;
base64UrlTests( 'H3110 \\/\\/021dZ! d4 `/4 1:|<3 d01142$?' , 'SDMxMTAgXC9cLzAyMWRaISBkNCBgLzQgMTp8PDMgZDAxMTQyJD8' ) ;
base64UrlTests( '^~#°%£µ*§$' , 'Xn4jwrAlwqPCtSrCpyQ' ) ;
```

