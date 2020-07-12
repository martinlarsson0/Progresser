import React from 'react'
import './card.css'
import weight from '../../images/weight.jpg'

const Card = ({ duration, key }: { duration:number, key:number }) => 
    <div className="card">
        <img src={weight} alt="Weights" className="card-image" />
        <div className="container">
            <h3>Weights <span className="price">{"<3"}</span></h3>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis a, dolorem, odio omnis quae
                 adipisci impedit tempore ipsum magni voluptate harum id ducimus vitae doloremque officiis 
                 obcaecati sint officia ut!
            </p>
        </div>
    </div>

export default Card