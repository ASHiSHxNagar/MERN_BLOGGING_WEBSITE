import React, { createContext, useContext, useState } from 'react'
import { UserContext } from '../App'
import { Navigate } from 'react-router-dom'
import BlogEditor from '../components/BlogEditor'
import PublishForm from '../components/PublishForm'

const blogsStructure = {
    title: "",
    banner: "",
    content: [],
    tags: [],
    des: "",
    author: { personal_info: {} }
}

export const EditorContext = createContext({})

const Editor = () => {
    const [blog, setBlog] = useState(blogsStructure)
    const [editorState, setEditorState] = useState("editor")
    const [textEditor, setTextEditor] = useState({ isReady: false })

    // Ensure UserContext is defined before destructuring
    const userContext = useContext(UserContext);
    const access_token = userContext?.userAuth?.access_token ?? null;

    if (access_token === null) {
        return <Navigate to="/signin/" />;
    }

    return (
        <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
            {
                editorState === "editor" ? <BlogEditor /> : <PublishForm />
            }
        </EditorContext.Provider>
    )
}

export default Editor