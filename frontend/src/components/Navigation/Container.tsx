/**
 * Container Component
 * Responsive container with multiple variants and sizes
 */

import React from 'react';
import { ContainerProps } from './types';
import './Navigation.css';

const Container: React.FC<ContainerProps> = ({
  children,
  variant = 'default',
  size = 'lg',
  noPadding = false,
  noMargin = false,
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component
      className={`
        container-component
        ${variant}
        ${noMargin ? 'no-margin' : ''}
        ${className}
      `}
    >
      <div
        className={`
          container-inner
          ${size}
          ${noPadding ? 'no-padding' : ''}
        `}
      >
        {children}
      </div>
    </Component>
  );
};

export default Container;
