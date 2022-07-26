import React, { Component } from 'react'
import swaggerService from './swaggerService';
import PathsList from './PathsList';

class WelcomeComp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info: {},
            paths: {},
            mail: {},
            license: {},
            host: '',
            externalDocs: {}
        }
    }


    componentDidMount() {
        swaggerService.retrieveApi()
            .then(
                response => {
                    this.setState({
                        mail: response.data.info.contact.email,
                        info: response.data.info,
                        license: response.data.info.license,
                        externalDocs: response.data.externalDocs,
                        host: response.data.host,
                        paths: JSON.parse(JSON.stringify(response.data.paths)
                            .replace(/\//g, ""))
                    })
                    console.log(response.data)
                }
            )
            .catch(
                error => {
                    console.log(error);
                }
            )
    }
    render() {
        const { info, mail, license, paths, host, externalDocs } = this.state
        console.log(paths);

        return (
            <div>
                <div className="box-content h-auto w-auto py-7 bg-gray-50 border-2">
                    <div className='swaggerCard'>
                        <section className='align-text-top pb-3'>
                            <h3 className='text-4xl font-bold text-sky-900'>{info.title} <sup className="font-features sups bg-gray-500 text-sm rounded-3xl text-white">1.0.6</sup> </h3>
                            <p className='text-xs text font-mono'>[Base URL : {host} ]</p>
                        </section>
                    </div>
                    <section>
                        <div >
                            <h4 className='font-sans text-sky-900 text-sm '>{info.description}</h4><br></br>
                            <section className='font-mono text-sm'>
                                <p><a className='text-sky-300 hover:text-blue-400 transition duration-150 ease-in-out' href={info.termsOfService}>Terms Of Service</a></p>
                                <p><a className='text-sky-300 hover:text-blue-400 transition duration-150 ease-in-out' href={mail}>Contact the developer</a></p>
                                <p><a className='text-sky-300 hover:text-blue-400 transition duration-150 ease-in-out' href={license.url}>{license.name}</a></p>
                                <p><a className='text-sky-300 hover:text-blue-400 transition duration-150 ease-in-out' href={externalDocs.url}>Find out more about Swagger</a></p>
                            </section>
                        </div>
                    </section>


                </div>
                <div className="box-content h-auto w-auto py-7 bg-white-50 border-t-2">
                    <div className='flex justify-between'>
                        <div>
                            <h3>Schemes</h3>
                            <button className='bg-transparent hover:shadow-black text-black font-semibold py-2 px-4 border border-black hover:shadow-sm rounded'>HTTPS</button>
                        </div>
                        <div className='pt-4'>
                            <button className='bg-transparent hover:shadow-green-500 text-green-700 font-semibold py-2 px-4 border border-green-500 hover:shadow-sm rounded'>Authorize</button>
                        </div>
                    </div>
                </div>
                <div className="box-content h-auto w-full py-7 px-3 bg-gray-50 border-t-2">
                    <div>
                        <PathsList />
                    </div>
                </div>
            </div>
        )
    }
}

export default WelcomeComp;