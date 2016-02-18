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

"use strict" ;



var uint8buffer = {} ;
module.exports = uint8buffer ;



// Partial polyfill: contains only needed things

if ( ! Uint8Array ) { Uint8Array = Array ; }	// jshint ignore:line

// Seriously, Chrome... 
if ( ! Uint8Array.prototype.slice ) { Uint8Array.prototype.slice = Array.prototype.slice ; }

if ( ! Uint16Array ) { Uint16Array = Array ; }	// jshint ignore:line

/*
if ( ! Uint32Array ) { Uint32Array = Array ; }
if ( ! Uint32Array.prototype.slice ) { Uint32Array.prototype.slice = Array.prototype.slice ; }
*/





		/* Full conversion */



uint8buffer.toString = function toString( uint8 , encoding )
{
	if ( ! encoding ) { encoding = 'utf8' ; }
	
	switch ( encoding )
	{
		case 'utf8' :
			return uint8buffer.readUtf8( uint8 , 0 , uint8.length ) ;
		case 'base64url' :
			return uint8buffer.readBase64Url( uint8 , 0 , uint8.length ) ;
		case 'hex' :
			return uint8buffer.readHex( uint8 , 0 , uint8.length ) ;
		case 'utf16' :
			return uint8buffer.readUtf16( uint8 , 0 , uint8.length ) ;
		case 'ascii' :
			return uint8buffer.readAscii( uint8 , 0 , uint8.length ) ;
	}
} ;

uint8buffer.fromString = function fromString( str , encoding )
{
	var uint8 , size ;
	
	if ( ! encoding ) { encoding = 'utf8' ; }
	
	switch ( encoding )
	{
		case 'utf8' :
			var array = [] ;
			uint8buffer.writeUtf8( array , str , 0 , undefined , true ) ;
			return new Uint8Array( array ) ;
		case 'base64url' :
			size = Math.floor( str.length * 3 / 4 ) ;
			uint8 = new Uint8Array( size ) ;
			uint8buffer.writeBase64Url( uint8 , str , 0 , size ) ;
			return uint8 ;
		case 'hex' :
			size = Math.floor( str.length / 2 ) ;
			uint8 = new Uint8Array( size ) ;
			uint8buffer.writeHex( uint8 , str , 0 , size ) ;
			return uint8 ;
		case 'utf16' :
			uint8 = new Uint8Array( str.length * 2 ) ;
			uint8buffer.writeUtf16( uint8 , str , 0 , str.length * 2 ) ;
			return uint8 ;
		case 'ascii' :
			uint8 = new Uint8Array( str.length ) ;
			uint8buffer.writeAscii( uint8 , str , 0 , str.length ) ;
			return uint8 ;
	}
} ;





			/* Numbers */



// Unsigned

uint8buffer.readUInt8 = function readUInt8( uint8 , offset )
{
	return uint8[ offset ] ;
} ;



uint8buffer.writeUInt8 = function writeUInt8( uint8 , value , offset )
{
	uint8[ offset ] = value & 255 ;
} ;



uint8buffer.readUInt16BE = uint8buffer.readUInt16 = function readUInt16( uint8 , offset )
{
	return ( uint8[ offset ] << 8 ) | ( uint8[ offset + 1 ] ) ;
} ;



uint8buffer.writeUInt16BE = uint8buffer.writeUInt16 = function writeUInt16( uint8 , value , offset )
{
	uint8[ offset ] = ( value >>> 8 ) & 255 ;
	uint8[ offset + 1 ] = value & 255 ;
} ;



uint8buffer.readUInt32BE = uint8buffer.readUInt32 = function readUInt32( uint8 , offset )
{
	return ( uint8[ offset ] * 0x1000000 ) |	// do not use << 24 here
		( uint8[ offset + 1 ] << 16 ) |
		( uint8[ offset + 2 ] << 8 ) |
		( uint8[ offset + 3 ] ) ;
} ;



uint8buffer.writeUInt32BE = uint8buffer.writeUInt32 = function writeUInt32( uint8 , value , offset )
{
	uint8[ offset ] = ( value >>> 24 ) & 255 ;
	uint8[ offset + 1 ] = ( value >>> 16 ) & 255 ;
	uint8[ offset + 2 ] = ( value >>> 8 ) & 255 ;
	uint8[ offset + 3 ] = value & 255 ;
} ;



uint8buffer.readUIntBE = uint8buffer.readUInt = function readUInt( uint8 , offset , byteLength )
{
	var value = uint8[ offset + --byteLength ] ;
	var mul = 1 ;
	
	while ( byteLength > 0 && ( mul *= 0x100 ) )
	{
		value += uint8[ offset + --byteLength ] * mul ;
	}
	
	return value ;
} ;



uint8buffer.writeUIntBE = uint8buffer.writeUInt = function writeUInt( uint8 , value , offset , byteLength )
{
	var i = byteLength - 1 ;
	var mul = 1 ;
	
	uint8[ offset + i ] = value ;
	
	while ( -- i >= 0 && ( mul *= 0x100 ) )
	{
		uint8[ offset + i ] = ( value / mul ) >>> 0 ;
	}
	
	return offset + byteLength ;
} ;



// Signed integer

uint8buffer.readInt8 = function readInt8( uint8 , offset )
{
	var value = uint8[ offset ] ;
	return ( value & 0x80 ) ? value | 0xffffff00 : value ;
} ;



uint8buffer.writeInt8 = function writeInt8( uint8 , value , offset )
{
	uint8[ offset ] = value & 255 ;
} ;



uint8buffer.readInt16BE = uint8buffer.readInt16 = function readInt16( uint8 , offset )
{
	var value = ( uint8[ offset ] << 8 ) | ( uint8[ offset + 1 ] ) ;
	return ( value & 0x8000 ) ? value | 0xffff0000 : value ;
} ;



uint8buffer.writeInt16BE = uint8buffer.writeInt16 = function writeInt16( uint8 , value , offset )
{
	uint8[ offset ] = ( value >>> 8 ) & 255 ;
	uint8[ offset + 1 ] = value & 255 ;
} ;



uint8buffer.readInt32BE = uint8buffer.readInt32 = function readInt32( uint8 , offset )
{
	return ( uint8[ offset ] << 24 ) |
		( uint8[ offset + 1 ] << 16 ) |
		( uint8[ offset + 2 ] << 8 ) |
		( uint8[ offset + 3 ] ) ;
} ;



uint8buffer.writeInt32BE = uint8buffer.writeInt32 = function writeInt32( uint8 , value , offset )
{
	uint8[ offset ] = ( value >>> 24 ) & 255 ;
	uint8[ offset + 1 ] = ( value >>> 16 ) & 255 ;
	uint8[ offset + 2 ] = ( value >>> 8 ) & 255 ;
	uint8[ offset + 3 ] = value & 255 ;
} ;



uint8buffer.readIntBE = uint8buffer.readInt = function readInt( uint8 , offset , byteLength )
{
	var i = byteLength ;
	var mul = 1 ;
	var value = uint8[ offset + --i ] ;
	
	while ( i > 0 && ( mul *= 0x100 ) )
	{
		value += uint8[ offset + --i ] * mul ;
	}
	
	mul *= 0x80 ;
	
	if ( value >= mul )
	{
		value -= Math.pow( 2 , 8 * byteLength ) ;
	}
	
	return value ;
} ;



uint8buffer.writeIntBE = uint8buffer.writeInt = function writeInt( uint8 , value , offset , byteLength )
{
	var i = byteLength - 1 ;
	var mul = 1 ;
	var sub = value < 0 ? 1 : 0 ;
	
	uint8[ offset + i ] = value ;
	
	while ( --i >= 0 && ( mul *= 0x100 ) )
	{
		uint8[ offset + i ] = ( ( value / mul ) >> 0 ) - sub ;
	}
	
	return offset + byteLength ;
} ;





			/* Buffer and buffer-like */



uint8buffer.readBuffer = function readBuffer( uint8 , offset , byteLength )
{
	var i , iMax , buffer ;
	
	if ( byteLength === undefined ) { byteLength = uint8.length - offset ; }
	
	iMax = Math.min( byteLength , uint8.length - offset ) ;
	
	buffer = new Uint8Array( iMax ) ;
	
	for ( i = 0 ; i < iMax ; i ++ )
	{
		buffer[ i ] = uint8[ i + offset ] ;
	}
	
	return buffer ;
} ;



uint8buffer.writeBuffer = function writeBuffer( uint8 , buffer , offset , byteLength )
{
	var i , iMax ;
	
	if ( byteLength === undefined ) { byteLength = buffer.length ; }
	
	iMax = Math.min( buffer.length , byteLength , uint8.length - offset ) ;
	
	for ( i = 0 ; i < iMax ; i ++ )
	{
		uint8[ i + offset ] = buffer[ i ] & 255 ;
	}
} ;





			/* Hex */



uint8buffer.readHex = function readHex( uint8 , offset , byteLength )
{
	var index , indexMax , charIndex , str = '' , base16 ;
	
	if ( byteLength === undefined ) { byteLength = uint8.length - offset ; }
	
	indexMax = Math.min( offset + byteLength , uint8.length ) ;
	
	for ( index = offset ; index < indexMax ; index ++ , charIndex += 2 )
	{
		base16 = uint8[ index ].toString( 16 ) ;
		if ( base16.length === 1 ) { base16 = '0' + base16 ; }
		str += base16 ;
	}
	
	return str ;
} ;



uint8buffer.writeHex = function writeHex( uint8 , str , offset , byteLength )
{
	var index , indexMax , charIndex = 0 ;
	
	if ( str.length % 2 ) { str = '0' + str ; }
	if ( byteLength === undefined ) { byteLength = Math.floor( str.length / 2 ) ; }
	
	//indexMax = Math.min( offset + Math.floor( str.length / 2 ) , offset + byteLength , uint8.length ) ;
	indexMax = Math.min( offset + byteLength , uint8.length ) ;
	if ( byteLength * 2 > str.length ) { charIndex = str.length - byteLength * 2 ; }
	
	for ( index = offset ; index < indexMax ; index ++ , charIndex += 2 )
	{
		if ( charIndex < 0 ) { uint8[ index ] = 0 ; }
		else { uint8[ index ] = parseInt( str[ charIndex ] + str[ charIndex + 1 ] , 16 ) || 0 ; }
	}
} ;





			/* ASCII */



uint8buffer.readAscii = function readAscii( uint8 , offset , byteLength )
{
	return String.fromCharCode.apply( undefined , uint8.slice( offset , byteLength === undefined ? uint8.length : offset + byteLength ) ) ;
} ;



uint8buffer.writeAscii = function writeAscii( uint8 , str , offset , byteLength )
{
	var i , iMax ;
	
	if ( byteLength === undefined ) { byteLength = str.length ; }
	
	iMax = Math.min( str.length , byteLength , uint8.length - offset ) ;
	
	for ( i = 0 ; i < iMax ; i ++ )
	{
		uint8[ offset + i ] = str.charCodeAt( i ) & 255 ;
	}
} ;





			/* UTF 16 */



uint8buffer.readUtf16 = function readUtf16( uint8 , offset , byteLength )
{
	var i , iMax , uint16 ;
	
	if ( byteLength === undefined ) { byteLength = uint8.length - offset ; }
	
	iMax = Math.floor( Math.min( byteLength , uint8.length - offset ) / 2 ) ;
	
	uint16 = new Uint16Array( iMax ) ;
	
	for ( i = 0 ; i < iMax ; i ++ )
	{
		uint16[ i ] = uint8buffer.readUInt16( uint8 , offset + i * 2 ) ;
	}
	
	return String.fromCharCode.apply( undefined , uint16 ) ;
} ;



uint8buffer.writeUtf16 = function writeUtf16( uint8 , str , offset , byteLength )
{
	var i , iMax ;
	
	if ( byteLength === undefined ) { byteLength = str.length * 2 ; }
	
	iMax = Math.floor( Math.min( str.length * 2 , byteLength , uint8.length - offset ) / 2 ) ;
	
	for ( i = 0 ; i < iMax ; i ++ )
	{
		uint8buffer.writeUInt16( uint8 , str.charCodeAt( i ) , offset + i * 2 ) ;
	}
} ;





			/* UTF 8 */



uint8buffer.readUtf8 = function readUtf8( uint8 , offset , byteLength )
{
	var index , indexMax , array = [] , charBytes = 0 , charIndex = 0 , charCode , surrogatePair ;
	
	if ( byteLength === undefined ) { byteLength = uint8.length - offset ; }
	
	// Nothing can be predicted here...
	
	indexMax = Math.min( offset + byteLength , uint8.length ) ;
	
	for ( index = offset ; index < indexMax ; index += charBytes , charIndex ++ )
	{
		if ( uint8[ index ] === 0x00 )
		{
			break ;
		}
		else if ( uint8[ index ] < 0x80 )
		{
			charBytes = 1 ;
			charCode = uint8[ index ] ;	// 0xxxxxxx
		}
		else if ( uint8[ index ] < 0xc0 )
		{
			// We are in a middle of an unicode multibyte sequence: ignore this char!
			continue ;
		}
		else if ( uint8[ index ] < 0xe0 )
		{
			charBytes = 2 ;
			if ( index + charBytes > indexMax ) { break ; }
			charCode =
				( ( uint8[ index ] & 0x1f ) << 6 ) |	// 110xxxxx
				( uint8[ index + 1 ] & 0x3f ) ;			// 10xxxxxx
		}
		else if ( uint8[ index ] < 0xf0 )
		{
			charBytes = 3 ;
			if ( index + charBytes > indexMax ) { break ; }
			charCode =
				( ( uint8[ index ] & 0x0f ) << 12 ) |		// 1110xxxx
				( ( uint8[ index + 1 ] & 0x3f ) ) << 6 |	// 10xxxxxx
				( uint8[ index + 2 ] & 0x3f ) ;				// 10xxxxxx
		}
		else if ( uint8[ index ] < 0xf8 )
		{
			charBytes = 4 ;
			if ( index + charBytes > indexMax ) { break ; }
			charCode =
				( ( uint8[ index ] & 0x07 ) << 18 ) |		// 11110xxx
				( ( uint8[ index + 1 ] & 0x3f ) ) << 12 |	// 10xxxxxx
				( ( uint8[ index + 2 ] & 0x3f ) ) << 6 |	// 10xxxxxx
				( uint8[ index + 3 ] & 0x3f ) ;				// 10xxxxxx
		}
		else if ( uint8[ index ] < 0xfc )
		{
			charBytes = 5 ;
			if ( index + charBytes > indexMax ) { break ; }
			charCode =
				( ( uint8[ index ] & 0x03 ) << 24 ) |		// 111110xx
				( ( uint8[ index + 1 ] & 0x3f ) ) << 18 |	// 10xxxxxx
				( ( uint8[ index + 2 ] & 0x3f ) ) << 12 |	// 10xxxxxx
				( ( uint8[ index + 3 ] & 0x3f ) ) << 6 |	// 10xxxxxx
				( uint8[ index + 4 ] & 0x3f ) ;				// 10xxxxxx
			
		}
		else
		{
			charBytes = 6 ;
			if ( index + charBytes > indexMax ) { break ; }
			charCode =
				( ( uint8[ index ] & 0x01 ) << 30 ) |		// 1111110x
				( ( uint8[ index + 1 ] & 0x3f ) ) << 24 |	// 10xxxxxx
				( ( uint8[ index + 2 ] & 0x3f ) ) << 18 |	// 10xxxxxx
				( ( uint8[ index + 3 ] & 0x3f ) ) << 12 |	// 10xxxxxx
				( ( uint8[ index + 4 ] & 0x3f ) ) << 6 |	// 10xxxxxx
				( uint8[ index + 5 ] & 0x3f ) ;				// 10xxxxxx
		}
		
		if ( charCode > 0xffff )
		{
			if ( charCode > 0x10ffff ) { continue ; }	// it cannot be encoded back in Javascript utf16/ucs2
			
			surrogatePair = uint8buffer.surrogatePairFromCodePoint( charCode ) ;
			array[ charIndex ] = surrogatePair[ 0 ] ;
			array[ ++ charIndex ] = surrogatePair[ 1 ] ;
		}
		else
		{
			array[ charIndex ] = charCode ;
		}
	}
	
	return String.fromCharCode.apply( undefined , array ) ;
} ;



uint8buffer.writeUtf8 = function writeUtf8( uint8 , str , offset , byteLength , usingArray )
{
	var index , indexMax , charBytes , charIndex = 0 , charIndexMax = str.length , charCode ;
	
	// Nothing can be predicted here...
	
	if ( usingArray )
	{
		if ( byteLength === undefined ) { byteLength = Infinity ; }
		indexMax = offset + byteLength ;
	}
	else
	{
		if ( byteLength === undefined ) { byteLength = uint8.length - offset ; }
		indexMax = Math.min( offset + byteLength , uint8.length ) ;
	}
	
	
	for ( index = offset ; index < indexMax && charIndex < charIndexMax ; index += charBytes , charIndex ++ )
	{
		charCode = str.charCodeAt( charIndex ) ;
		
		if ( charCode >= 0xd800 && charCode <= 0xdfff )
		{
			// This is a surrogate pair
			if ( charCode < 0xdc00 )
			{
				// high/leading surrogate
				charIndex ++ ;
				if ( charIndex >= charIndexMax ) { break ; }	// Encoding error, it should not end with a leading surrogate
				charCode = uint8buffer.codePointFromSurrogatePair( charCode , str.charCodeAt( charIndex ) ) ;
			}
			else
			{
				// low/trailing surrogate: this should never happen!
				// Trailing surrogate are always eaten when a high surrogate is detected.
				// So this an encoding error, we will just skip that.
				continue ;
			}
		}
		
		// Unicode bytes per char guessing
		if ( charCode < 0x80 )
		{
			charBytes = 1 ;
			uint8[ index ] = charCode ;	// 0xxxxxxx
		}
		else if ( charCode < 0x0800 )
		{
			charBytes = 2 ;
			
			// Does it overflows the buffer?
			if ( index + charBytes > indexMax ) { break ; }
			
			uint8[ index ] = ( ( charCode >> 6 ) & 0x1f ) | 0xc0 ;	// 110xxxxx
			uint8[ index + 1 ] = ( charCode & 0x3f ) | 0x80 ;		// 10xxxxxx
		}
		else if ( charCode < 0x010000 )
		{
			charBytes = 3 ;
			
			// Does it overflows the buffer?
			if ( index + charBytes > indexMax ) { break ; }
			
			uint8[ index ] = ( ( charCode >> 12 ) & 0x0f ) | 0xe0 ;		// 1110xxxx
			uint8[ index + 1 ] = ( ( charCode >> 6 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 2 ] = ( charCode & 0x3f ) | 0x80 ;			// 10xxxxxx
		}
		else if ( charCode < 0x200000 )
		{
			charBytes = 4 ;
			
			// Does it overflows the buffer?
			if ( index + charBytes > indexMax ) { break ; }
			
			uint8[ index ] = ( ( charCode >> 18 ) & 0x07 ) | 0xf0 ;		// 11110xxx
			uint8[ index + 1 ] = ( ( charCode >> 12 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 2 ] = ( ( charCode >> 6 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 3 ] = ( charCode & 0x3f ) | 0x80 ;			// 10xxxxxx
		}
		else if ( charCode < 0x40000000 )
		{
			charBytes = 5 ;
			
			// Does it overflows the buffer?
			if ( index + charBytes > indexMax ) { break ; }
			
			uint8[ index ] = ( ( charCode >> 24 ) & 0x03 ) | 0xf8 ;		// 111110xx
			uint8[ index + 1 ] = ( ( charCode >> 18 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 2 ] = ( ( charCode >> 12 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 3 ] = ( ( charCode >> 6 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 4 ] = ( charCode & 0x3f ) | 0x80 ;			// 10xxxxxx
		}
		else
		{
			charBytes = 6 ;
			
			// Does it overflows the buffer?
			if ( index + charBytes > indexMax ) { break ; }
			
			uint8[ index ] = ( ( charCode >> 30 ) & 0x01 ) | 0xfc ;		// 1111110x
			uint8[ index + 1 ] = ( ( charCode >> 24 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 2 ] = ( ( charCode >> 18 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 3 ] = ( ( charCode >> 12 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 4 ] = ( ( charCode >> 6 ) & 0x3f ) | 0x80 ;	// 10xxxxxx
			uint8[ index + 5 ] = ( charCode & 0x3f ) | 0x80 ;			// 10xxxxxx
		}
	}
} ;



uint8buffer.surrogatePairFromCodePoint = function surrogatePairFromCodePoint( codePoint )
{
	return [
		Math.floor( ( codePoint - 0x10000 ) / 0x400 ) + 0xD800 ,
		( codePoint - 0x10000 ) % 0x400 + 0xDC00
	] ;
} ;



uint8buffer.codePointFromSurrogatePair = function codePointFromSurrogatePair( high , low )
{
	return ( high - 0xD800 ) * 0x400 + low - 0xDC00 + 0x10000 ;
} ;





			/* URL-compatible Base64 */



var uint6ToBase64UrlChar = [
	'A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' ,
	'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z' ,
	'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' ,
	'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z' ,
	'0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' ,
	'-' , '_'
] ;

var base64UrlCharToUint6 = new Uint8Array( 256 ) ;

( function() {
	for ( var i = 0 ; i < uint6ToBase64UrlChar.length ; i ++ )
	{
		base64UrlCharToUint6[ uint6ToBase64UrlChar[ i ].charCodeAt( 0 ) ] = i ;
	}
} )() ;



// Concatenating big string can be slow, maybe it should be rewritten using a temporary Uint8Array,
// then calling String.fromCharCode( array )

uint8buffer.readBase64Url = function readBase64Url( uint8 , offset , byteLength )
{
	var index , indexMax , str = '' ;
	
	if ( byteLength === undefined ) { byteLength = uint8.length - offset ; }
	
	indexMax = Math.min( offset + byteLength , uint8.length ) ;
	
	for ( index = offset ; index + 2 < indexMax ; index += 3 )
	{
		str +=
			uint6ToBase64UrlChar[ ( uint8[ index ] >> 2 ) ] +
			uint6ToBase64UrlChar[ ( ( uint8[ index ] & 0x03 ) << 4 ) + ( uint8[ index + 1 ] >> 4 ) ] +
			uint6ToBase64UrlChar[ ( ( uint8[ index + 1 ] & 0x0f ) << 2 ) + ( uint8[ index + 2 ] >> 6 ) ] +
			uint6ToBase64UrlChar[ uint8[ index + 2 ] & 0x3f ] ;
	}
	
	switch( indexMax - index )
	{
		case 1 :
			str +=
				uint6ToBase64UrlChar[ ( uint8[ index ] >> 2 ) ] +
				uint6ToBase64UrlChar[ ( ( uint8[ index ] & 0x03 ) << 4 ) ] ;
			break ;
		
		case 2 :
			str +=
				uint6ToBase64UrlChar[ ( uint8[ index ] >> 2 ) ] +
				uint6ToBase64UrlChar[ ( ( uint8[ index ] & 0x03 ) << 4 ) + ( uint8[ index + 1 ] >> 4 ) ] +
				uint6ToBase64UrlChar[ ( ( uint8[ index + 1 ] & 0x0f ) << 2 ) ] ;
			break ;
	}
	
	return str ;
} ;



uint8buffer.writeBase64Url = function writeBase64Url( uint8 , str , offset , byteLength )
{
	var index , indexMax , charIndex , charIndexMax , extraChars ,
		a , b , c , d ;
	
	// Should be 0, 2 or 3
	extraChars = str.length % 4 ;
	if ( extraChars === 1 ) { throw new Error( "Bad base64-url length" ) ; }
	
	indexMax = offset + byteLength ;
	charIndexMax = str.length - extraChars ;
	
	//console.log( "extraChars:" , extraChars ) ;
	//console.log( "charIndexMax:" , charIndexMax ) ;
	
	for ( index = offset , charIndex = 0 ; index + 2 < indexMax && charIndex < charIndexMax ; index += 3 , charIndex += 4 )
	{
		a = base64UrlCharToUint6[ str.charCodeAt( charIndex ) ] ;
		//console.log( "### a:" , str[ charIndex ] , str.charCodeAt( charIndex ) , a ) ;
		b = base64UrlCharToUint6[ str.charCodeAt( charIndex + 1 ) ] ;
		//console.log( "### b:" , str[ charIndex + 1 ] , str.charCodeAt( charIndex + 1 ) , b ) ;
		c = base64UrlCharToUint6[ str.charCodeAt( charIndex + 2 ) ] ;
		//console.log( "### c:" , str[ charIndex + 2 ] , str.charCodeAt( charIndex + 2 ) , c ) ;
		d = base64UrlCharToUint6[ str.charCodeAt( charIndex + 3 ) ] ;
		//console.log( "### d:" , str[ charIndex + 3 ] , str.charCodeAt( charIndex + 3 ) , d ) ;
		
		uint8[ index ] = ( a << 2 ) + ( b >> 4 ) ;
		uint8[ index + 1 ] = ( b << 4 ) + ( c >> 2 ) ;
		uint8[ index + 2 ] = ( c << 6 ) + d ;
	}
	
	switch( extraChars )
	{
		case 2 :
			if ( index >= indexMax ) { break ; }
			
			a = base64UrlCharToUint6[ str.charCodeAt( charIndex ) ] ;
			b = base64UrlCharToUint6[ str.charCodeAt( charIndex + 1 ) ] ;
			
			uint8[ index ] = ( a << 2 ) + ( b >> 4 ) ;
			break ;
		
		case 3 :
			if ( index + 1 >= indexMax ) { break ; }
			
			a = base64UrlCharToUint6[ str.charCodeAt( charIndex ) ] ;
			b = base64UrlCharToUint6[ str.charCodeAt( charIndex + 1 ) ] ;
			c = base64UrlCharToUint6[ str.charCodeAt( charIndex + 2 ) ] ;
			
			uint8[ index ] = ( a << 2 ) + ( b >> 4 ) ;
			uint8[ index + 1 ] = ( b << 4 ) + ( c >> 2 ) ;
			break ;
	}
} ;


