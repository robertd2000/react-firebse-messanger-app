import React, { useEffect, useState } from 'react'
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import Camera from '../components/svg/Camera'
import Delete from '../components/svg/Delete'
import Img from '../image1.jpg'
import { auth, db, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


export const Profile = () => {
    const [img, setImg] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        getDoc(doc(db, 'users', auth.currentUser.uid)).then(docSnap => {
            if (docSnap.exists) {
                setUser(docSnap.data())
            }
        })
        if (img) {
            const uploadImg = async () => {
                const imgRef = ref(storage, `avatar/${new Date().getTime()} - ${img.name}`)
                try {
                    if (user.avatarPath) {
                        await deleteObject(ref(storage, user.avatarPath))
                    }
                    const snap = await uploadBytes(imgRef, img)
                    const url = await getDownloadURL(ref(storage, snap.ref.fullPath))
                    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                        avatar: url,
                        avatarPath: snap.ref.fullPath
                    })
                    setImg('')   
                } catch (err) {
                    console.log(err.message);
                }
            }
            uploadImg()
        }
    }, [img])

    const history = useNavigate()

    const deleteAvatar = async () => {
        try {
            const confirm = window.confirm('Delete avatar?')
            if (confirm) {
                await deleteObject(ref(storage, user.avatarPath))
                await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                    avatar: '',
                    avatarPath: ''
                })
                history('/')
            }

        } catch (err) {
            console.log(err.message);
        }
    }
    return user ? (
        <>
         <section>
            <div className="profile_container">
                <div className="img_container ">
                    <img src={user.avatar || Img} alt='avatar' />
                    <div className='overlay'>
                        <div>
                            <label htmlFor='photo'>
                                <Camera />
                            </label>
                            {user.avatar ? <Delete deleteImage={deleteAvatar} /> : null}
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
                <h3>{user.name}</h3>
                <h3>{user.email}</h3>
                <hr />
                <small>Joined on {user.createdAt.toDate().toDateString()}</small>
            </div>
        </section>   
        </>
    ) : null
}
