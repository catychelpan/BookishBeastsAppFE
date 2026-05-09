import React from 'react';
import { Image, Platform } from 'react-native';

const ImageHandler = ({ source, style, ...props }) => {
  // Function to ensure image URL is HTTPS on iOS
  const getProperImageUrl = (url) => {
    if (Platform.OS === 'ios' && typeof url === 'string') {
      // Force HTTPS for iOS
      if (url.startsWith('http://')) {
        return url.replace('http://', 'https://');
      }
      
      // Handle relative URLs
      if (url.startsWith('//')) {
        return `https:${url}`;
      }
    }
    return url;
  };

  // Handle different types of source props
  const getImageSource = (source) => {
    if (typeof source === 'number') {
      // Local image require()
      return source;
    }
    
    if (typeof source === 'object' && source.uri) {
      // Remote image with uri property
      return {
        ...source,
        uri: getProperImageUrl(source.uri)
      };
    }
    
    if (typeof source === 'string') {
      // Direct URL string
      return {
        uri: getProperImageUrl(source)
      };
    }
    
    return source;
  };

  return (
    <Image
      source={getImageSource(source)}
      className="rounded-[6px]"
      style={style}
      {...props}
    />
  );
};


export default ImageHandler;