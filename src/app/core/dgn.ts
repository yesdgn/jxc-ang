import {isString,isNaN,isNil,isNull,isArray,size,isPlainObject,now,random}  from 'lodash';

export function ifNull (obj)
{
  if (isString(obj) && obj==='' ) return true;
  if (isArray(obj) && obj.length===0 ) return true;
  if (obj===undefined ) return true;
  if (isPlainObject(obj) && size(obj)<=0)  return true;
  if (isNaN(obj)) return true;
  if (isNil(obj)) return true;
  if (isNull(obj)) return true;
  return false;
}

export function getRandom()
{
  let n=now().toString()+random(100000,999999);
   return  n;
}

