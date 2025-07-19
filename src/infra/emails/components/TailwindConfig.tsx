import { Tailwind } from '@react-email/components';
import React from 'react';

interface ITailwindConfigProps {
  children: React.ReactNode;
}

export function TailwindConfig({ children }: ITailwindConfigProps) {
return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              foodiary: {
                green: '#64A30D',
              },
              gray: {
                600: '#A1A1AA',
              }
            },
          },
        },
      }}
    >
      {children}
    </Tailwind>
  );
}
