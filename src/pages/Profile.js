import React, { useState } from 'react'
import Camera from '../components/svg/Camera'
import Img from '../image1.jpg'


export const Profile = () => {
    const [img, setImg] = useState('')

    return (
        <>
         <section>
            <div className="profile_container">
                <div className="img_container ">
                    <img src={Img} alt='avatar' />
                    <div className='overlay'>
                        <div>
                            <label htmlFor='photo'>
                                <Camera />
                            </label>
                            <input 
                                type='file' 
                                id='photo' 
                                accept='image/*' 
                                style={{display: 'none'}}
                                onChange={e => setImg(e.target.files[0])} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='text_container'>
                <h3>User name</h3>
                <h3>User email</h3>
                <hr />
                <small>Joines on...</small>
            </div>
        </section>   
        </>
    )
}
