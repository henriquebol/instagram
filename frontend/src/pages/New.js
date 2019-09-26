import React, { useState } from 'react';
import api from '../services/api';

import './New.css';

export default function New (props){
    const [image, setImage] = useState(null);
    const [inputs, setInputs] = useState({author: "", place: "", description: "", hashtags: ""});

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData();

        data.append('image', image);
        data.append('author', inputs.author);
        data.append('place', inputs.place);
        data.append('description', inputs.description);
        data.append('hashtags', inputs.hashtags);

        await api.post('posts', data)

        props.history.push('/');
    }

    function handleImageChange(event) {
        setImage(event.target.files[0]);
    }

    const handleInputChange = (event) => {
        event.persist();
        setInputs({...inputs, [event.target.name]: event.target.value});
      }

    return (
        <form id="new-post" onSubmit={handleSubmit}>
            <input type="file" onChange={handleImageChange} />

            <input 
                type="text"
                name="author"
                placeholder="Autor do post"
                onChange={handleInputChange}
                value={inputs.author}
            />
            
            <input 
                type="text"
                name="place"
                placeholder="Local do post"
                onChange={handleInputChange}
                value={inputs.place}
            />

            <input 
                type="text"
                name="description"
                placeholder="Descrição do post"
                onChange={handleInputChange}
                value={inputs.description}
            />

            <input 
                type="text"
                name="hashtags"
                placeholder="Hashtags do post"
                onChange={handleInputChange}
                value={inputs.hashtags}
            />

            <button type="submit">Enviar</button>

        </form>
    );
}