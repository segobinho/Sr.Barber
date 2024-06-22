import React from "react";
import Header from '../../components/header/index';
import Main from '../../components/main/index';
import './style.css';
import axios from "axios";



function  Clientes() {
    
   
    return (
        <div>
            <Header />
            <Main>
                <div className="container">
                    <div className="bloco">
                        <div className="title">
                            <h1>Serviços</h1>
                          
                               
                                

                            
                        </div>
                     
                        
                        <hr />
          
                    </div>

                    <div className="bloco1">
                        <div className="container1">
                           
                            
                        </div>
                    </div>
                </div>
            </Main>
           
        </div>
    );  
}

export default Clientes;
