import React from "react";
import Header from '../components/header/index';
import Main	 from '../components/main/index';
import './style.css'



function Receba () {
    return(
        <div>
        <Header/>
       <Main>
        <div className="container">
    <div className="bloco">
      <div className="title">
        <h1>Serviços</h1>
        <input className="button1" type="button" value="+" />   
     </div>
      <hr />
      <div className="pesquisa">
      <input type="text" />
      </div>
    </div>
      
     <div className="bloco1">

      <div className="container1">

      <div className="info">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et qui adipisci explicabo aut doloribus. Nesciunt, harum. Ab excepturi minima eaque nesciunt, fugiat numquam, ad molestiae iste voluptatem quam, explicabo eveniet! Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, repudiandae nostrum, dicta quaerat earum quae id molestias ratione labore minus consectetur tempore illum est. Sint voluptatem fugiat iusto pariatur harum?</p>
      </div>
    
      <div className="serviço">
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat a aspernatur minus deleniti perspiciatis, repudiandae aperiam unde porro voluptatibus quos, enim incidunt veniam dolor ex nam harum corrupti odit ut?</p>
      </div>

      </div>
     
     </div>
     </div>
     </Main>
     
     </div>
   
     
   );
 }


export default Receba