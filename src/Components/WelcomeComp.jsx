import React, { Component } from 'react'
import swaggerService from './swaggerService';

class WelcomeComp extends Component {
    constructor(props){
        super(props)
        this.state = {
            info : {},
            paths: {},
            mail: {},
            license: {}
        }
    }

    
    componentDidMount() {
        swaggerService.retrieveApi()
            .then(
                response => {
                   this.setState({mail: response.data.info.contact.email,
                    info : response.data.info,
                    license : response.data.info.license,
                    // paths: response.data.paths
                    paths: JSON.parse(JSON.stringify(response.data.paths)
                    .replace(/\//g, ""))
                })
                //    this
    //             let str = JSON.stringify(this.state.paths)
    //    let stuff =str.replace(/\//g, "")
    //    const final = JSON.parse(stuff)
                }
            )
            .catch(
                error => {
                    console.log(error);
                }
            )
    }
    render() {
        // const [info, setInfo] = useState([]);
       const {info,mail,license,paths} = this.state
    
    //    this.setState({paths : final})
    //    console.log(str)
    console.log(paths);

        return (
            <div className="box-content h-32 w-full p-4 border-4 ...">
              <div className='swaggerCard'>
                <section>
                    <h3 className='text-4xl w-full bg-black text-white p-2.5 w-fit mt-9'>{info.title}</h3>
                    <p>baseurl</p>
                </section>
              </div>
              <section>
              <div className='links'>
                    <h4>{info.description}</h4><br></br>
                    <section>
                    <p><a href={info.termsOfService}>Terms Of Service</a></p>
                    <p><a href={mail}>Contact the developer</a></p>
                    <p><a href={license.url}>{license.name}</a></p>
                    <p><a href="swagger.io">Find out more about Swagger</a></p>

                    </section>
               </div>
              </section>
              <div>
                <section>
                <h3>pet <h5>Everything about your pets</h5></h3>
                <div>
              
                </div>
                </section>

              </div>
        
            </div>
        )
    }
}

export default WelcomeComp;