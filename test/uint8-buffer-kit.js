/*
	The Cedric's Swiss Knife (CSK) - CSK Uint8 Buffer toolbox

	Copyright (c) 2015 Cédric Ronvel 
	
	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

/* jshint unused:false */
/* global describe, it, before, after */

"use strict" ;



var u8buffer = require( '../lib/uint8-buffer-kit.js' ) ;
var expect = require( 'expect.js' ) ;





			/* Helper functions */



function base64UrlTests( str , base64Url )
{
	expect( stringToBase64Url( str ) ).to.equal( base64Url ) ;
	expect( base64UrlToString( base64Url ) ).to.equal( str ) ;
}



function stringToBase64Url( str )
{
	return u8buffer.toString( u8buffer.fromString( str ) , 'base64url' ) ;
}



function base64UrlToString( base64Url )
{
	return u8buffer.toString( u8buffer.fromString( base64Url , 'base64url' ) ) ;
}





			/* Tests */



describe( "URL-compatible Base64" , function() {
	
	it( "should encode and decode a string using Base64 URL encoding" , function() {
		
		base64UrlTests( '' , '' ) ;
		base64UrlTests( 'any carnal pleasure.' , 'YW55IGNhcm5hbCBwbGVhc3VyZS4' ) ;
		base64UrlTests( 'any carnal pleasure' , 'YW55IGNhcm5hbCBwbGVhc3VyZQ' ) ;
		base64UrlTests( 'Hello world' , 'SGVsbG8gd29ybGQ' ) ;
		base64UrlTests( 'Hello world!' , 'SGVsbG8gd29ybGQh' ) ;
		base64UrlTests( 'Hello world!!' , 'SGVsbG8gd29ybGQhIQ' ) ;
		base64UrlTests( 'Hello world!!!' , 'SGVsbG8gd29ybGQhISE' ) ;
		base64UrlTests( 'Hello world!!!!' , 'SGVsbG8gd29ybGQhISEh' ) ;
		base64UrlTests( 'H3110 \\/\\/021dZ! d4 `/4 1:|<3 d01142$?' , 'SDMxMTAgXC9cLzAyMWRaISBkNCBgLzQgMTp8PDMgZDAxMTQyJD8' ) ;
		base64UrlTests( '^~#°%£µ*§$' , 'Xn4jwrAlwqPCtSrCpyQ' ) ;
	} ) ;
} ) ;



describe( "Code..." , function() {
	it( "... a full test suite" ) ;
} ) ;


