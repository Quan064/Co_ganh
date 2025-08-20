import React, { useCallback, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'

export const TextEditorContext = React.createContext();

export default function TextEditorProvider({ children }) {
    const [editorState, setEditorState] = useState()

  return (
    <TextEditorContext.Provider
      value={{
        editorState, setEditorState
      }}
    >
      {children}
    </TextEditorContext.Provider>
  );
}