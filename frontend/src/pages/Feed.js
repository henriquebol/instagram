import React, { useState, useEffect } from 'react';

import './Feed.css';
import more from '../assets/more.svg';
import like from '../assets/like.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';

import api from '../services/api';
import io from 'socket.io-client';
const socket = io('http://localhost:3333');


export default function Feed () {
    const [ feed, setFeed ]   = useState([]);

    useEffect(updateList => {
        
        console.log("Atualizando...");
        api.get('posts')
        .then(response => { setFeed(response.data) })
        .catch(err => { console.error('Failed retrieving information', err); })
        .finally( () => { } ); // always executed

    }, []); // Como Está vazio [] executa só a primeira vez. Adicionando um state [list], executa a cada alteração 

      useEffect(() => {
        console.log("Criando sockets");

        socket.on('post', (newPost) => {
            setFeed([newPost, ...feed] );
        });

        socket.on('like', likedPost => {
            setFeed( feed.map(post => post._id === likedPost._id ? likedPost : post ) )
        });
        return () => {
          console.log("Removendo sockets");
          socket.off("post");
          socket.off("like");
        };
      });

    function handleLike(id) {
        api.post(`/posts/${id}/like`)
        .then(response => { console.log("Enviando Like"); })
        .catch(err => { console.error('Failed retrieving information', err); })
        .finally( () => { } ); // always executed
    }

    //render() {
        return (
            <section id="post-list">
                { feed.map(post => (
                    <article key={post._id}>
                    <header>
                        <div className="user-info">
                            <span>{post.author}</span>
                            <span className="place">{post.place}</span>
                        </div>

                        <img src={more} alt="Mais" />
                    </header>

                    <img src={`http://localhost:3333/files/${post.image}`} alt="" />

                    <footer>
                        <div className="actions">
                            <button type="button" onClick={() => handleLike(post._id)}>
                                <img src={like} alt="" />
                            </button>
                            <img src={comment} alt="" />
                            <img src={send} alt="" />
                        </div>

                        <strong>{post.likes} curtidas</strong>

                        <p>
                            {post.description}
                            <span>{post.hashtags}</span>
                        </p>
                    </footer>
                </article>
                ))}
            </section>
        );
    }