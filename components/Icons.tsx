import React from 'react';

type IconProps = {
  className?: string;
};

export const UsersIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.69c.125.14.242.285.35.437m-1.996-5.118a.75.75 0 10-1.06-1.06 3.75 3.75 0 015.304 0 .75.75 0 001.06 1.06 5.25 5.25 0 00-7.424 0zM9 10.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

export const AdjustmentsHorizontalIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
  </svg>
);

export const PuzzlePieceIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.66.538-1.187 1.2-1.187h.001c.66 0 1.199.527 1.199 1.187C16.65 6.753 16.11 7.28 15.45 7.28h-.001c-.66 0-1.2-.527-1.2-1.193zM12.75 21a2.25 2.25 0 01-2.25-2.25v-4.5a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25v4.5a2.25 2.25 0 01-2.25 2.25h-3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.087c0-.66.538-1.187 1.2-1.187h.001c.66 0 1.199.527 1.199 1.187C10.65 6.753 10.11 7.28 9.45 7.28h-.001c-.66 0-1.2-.527-1.2-1.193zM9.75 21a2.25 2.25 0 01-2.25-2.25v-4.5a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25v4.5a2.25 2.25 0 01-2.25 2.25h-3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5a2.25 2.25 0 012.25-2.25h4.5a2.25 2.25 0 012.25 2.25v3a2.25 2.25 0 01-2.25 2.25h-4.5a2.25 2.25 0 01-2.25-2.25v-3zM12.75 4.5a2.25 2.25 0 012.25-2.25h4.5a2.25 2.25 0 012.25 2.25v3a2.25 2.25 0 01-2.25 2.25h-4.5a2.25 2.25 0 01-2.25-2.25v-3z" />
  </svg>
);

export const HangUpIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13.3 10.92a.5.5 0 01-.58.63L11.5 11a1.01 1.01 0 00-1 1l.55 1.22a.5.5 0 01-.63.58l-1.9-1.3a14.73 14.73 0 01-3.2-3.11 14.5 14.5 0 01-1.33-4.48.5.5 0 01.5-.51l1.45.1a.5.5 0 01.47.65 11.18 11.18 0 001.38 3.86 11.33 11.33 0 003.58 3.48zM17.4 12.12a14.63 14.63 0 01-4.22 4.22l-1.3-1.9a.5.5 0 01.12-.7l1.2-.55a1.01 1.01 0 00-1-1l-1.22-.55a.5.5 0 01-.58-.63l1.3-1.9a14.38 14.38 0 014.22 4.22z" />
  </svg>
);

export const MuteIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 7.5v-1.5a6 6 0 00-6-6v-1.5a6 6 0 00-6 6v1.5m6 7.5a6 6 0 00-6-6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
  </svg>
);

export const UnmuteIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 7.5v-1.5a6 6 0 00-6-6v-1.5a6 6 0 00-6 6v1.5m6 7.5a6 6 0 00-6-6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75l16.5 16.5" />
    </svg>
);


export const ReportIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

export const CameraIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
);

export const PaperAirplaneIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);