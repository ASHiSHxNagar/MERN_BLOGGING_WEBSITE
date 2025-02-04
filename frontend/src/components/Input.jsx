import React, { useState } from 'react'

const Input = ({ name, type, id, value, placeholder, icon }) => {
    const [passwordVisable, setPasswordVisable] = useState(false)
    return (
        <div className='relative w-[100%] mb-4 '>
            <input name={name}
                type={type == "password" ? passwordVisable ? "text" : "password" : type}
                placeholder={placeholder}
                defaultValue={value}
                id={id}
                className='input-box'
            />

            <i className={"fi " + icon + " input-icon"}></i>

            {type == "password" ?
                <i className={"fi fi-rr-eye" + (!passwordVisable ? "-crossed" : "") + " input-icon left-[auto] right-4 cursor-pointer"}
                    onClick={() => setPasswordVisable(currentVal => !currentVal)}></i>
                : ""}
        </div>

    )
}

export default Input