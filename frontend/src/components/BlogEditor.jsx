import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from "../imgs/logo.png"
import PageAnimation from '../common/PageAnimation'
import defaultBanner from '../imgs/blog banner.png'
import { uploadImage } from '../common/Aws'
import { Toaster, toast } from 'react-hot-toast'
import { EditorContext } from '../pages/Editor'
import EditorJS from '@editorjs/editorjs'
import { Tools } from '../components/Tools'
import axios from 'axios'
import { UserContext } from '../App'

const BlogEditor = () => {
    let { blog, blog: { title, banner, content }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext)
    let { userAuth: { access_token } } = useContext(UserContext)
    let navigate = useNavigate()

    useEffect(() => {
        if (!textEditor.isReady) {
            setTextEditor(new EditorJS({
                holderId: 'textEditor',
                data: content,
                tools: Tools,
                placeholder: 'Start writing your blog...',
            }))
        }
    }, [])

    const handleBannerUpload = (e) => {
        let img = e.target.files[0]
        if (img) {
            let loadingToast = toast.loading('Uploading Image...')
            uploadImage(img).then((url) => {
                if (url) {
                    toast.dismiss(loadingToast)
                    toast.success('Image Uploaded')
                    setBlog(prev => ({ ...prev, banner: url }))
                }
            }).catch((err) => {
                toast.dismiss(loadingToast)
                return toast.error(err)
            })
        }
    }

    const handleTitleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
        }
    }

    const handleTitleChange = (e) => {
        let input = e.target
        input.style.height = 'auto'
        input.style.height = input.scrollHeight + 'px'
        setBlog({ ...blog, title: input.value })
    }

    const handleError = (e) => {
        let img = e.target
        img.src = defaultBanner
    }

    const handlePublishEvent = () => {
        if (!banner.length) {
            return toast.error("Please upload a banner to publish it")
        }
        if (!title.length) {
            return toast.error("Please enter a title to publish it")
        }
        if (textEditor.isReady) {
            textEditor.save().then(data => {
                if (data.blocks.length) {
                    setBlog({ ...blog, content: data })
                    setEditorState("publish")
                } else {
                    return toast.error("Please write some content to publish it")
                }
            }).catch(err => {
                console.log(err)
                return toast.error("Something went wrong, Please try again")
            })
        }
    }

    const handleSaveDraft = async (e) => {
        if (e.target.className.includes('disabled')) return
        if (!title.length) {
            return toast.error('Please add a title before saving it as a draft')
        }
        let loadingToast = toast.loading('Saving Draft...')
        e.target.classList.add('disabled')

        try {
            if (textEditor?.isReady) {
                const content = await textEditor.save()
                const blogObj = { ...blog, content, draft: true }

                await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/create-blog`, blogObj, {
                    headers: { Authorization: `Bearer ${access_token}` }
                })

                toast.dismiss(loadingToast)
                toast.success('Draft Saved')
                setTimeout(() => navigate('/'), 500)
            }
        } catch (error) {
            toast.dismiss(loadingToast)
            toast.error(error?.response?.data?.error || 'Failed to save draft')
        } finally {
            e.target.classList.remove('disabled')
        }
    }

    return (
        <>
            <nav className='navbar'>
                <Link to="/" className='flex-none w-10'>
                    <img src={logo} /></Link>
                <p className=' max-md:hidden text-black line-clamp-1 w-full'>
                    {title.length ? title : 'New Blog'}
                </p>

                <div className='flex gap-4 ml-auto'>
                    <button className='btn-dark py-2 '
                        onClick={handlePublishEvent}>Publish</button>
                    <button className='btn-light py-2 '
                        onClick={handleSaveDraft}>Save Draft</button>
                </div>
            </nav>
            <Toaster />
            <PageAnimation>
                <section>
                    <div className='mx-auto max-w-[900px] w-full'>
                        <div className='relative aspect-video hover:opacity-80 bg-white border-4 border-grey '>
                            <label>
                                <img src={banner} className='z-20'
                                    onError={handleError} />
                                <input id="uploadBanner" type="file" accept='.png,.jpg,.jpeg' hidden
                                    onChange={handleBannerUpload} />
                            </label>
                        </div>

                        <textarea
                            defaultValue={title}
                            placeholder='Title'
                            className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40'
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}>
                        </textarea>

                        <hr className='w-full opacity-20 my-5' />

                        <div id="textEditor" className='font-gelasio'>
                        </div>
                    </div>
                </section>
            </PageAnimation>
        </>
    )
}

export default BlogEditor