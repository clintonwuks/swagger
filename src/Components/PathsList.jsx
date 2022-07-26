import '../pathsList.css';
import {useEffect, useMemo, useRef, useState, useCallback} from "react";
import axios from "axios";

function PathsList() {
    const firstRender = useRef(true)
    const [data, setData] = useState(null)
  
    const tags = useMemo(() => (data || {}).tags, [data])
  
    const paths = useMemo(() => {
      if (!tags) return
      const formatted = {}
  
      for (const path in data.paths || {}) {
        const tag = path.split('/')[1]
        if (!formatted[tag]) formatted[tag] = []
  
        for (const method in data.paths[path]) {
          const {parameters, responses} = data.paths[path][method]
          formatted[tag].push({
            route: path,
            method,
            parameters,
            responses,
          })
        }
      }
  
      return formatted
    }, [data, tags])
  
    useEffect(() => {
      if (firstRender.current) {
        firstRender.current = false
        return
      }
  
      async function fetchData() {
        try {
          const {status, data} = await axios.get('https://petstore.swagger.io/v2/swagger.json')
          if (status === 200) setData(data)
        } catch (e) {
          console.error(e.message)
        }
      }
      fetchData().then()
    }, [])
  
    useEffect(() => {
      if (paths) console.log('paths', paths)
    }, [paths])
  
    useEffect(() => {
      if (data) console.log('data', data)
    }, [data])
  
  
    function formatParam(param, key='') {
      let { type, schema, name, in: location } = param
  
      return (
          <div className={'param-item'} key={`${key}-param-${param.name}`} style={{display: "flex", columnGap: "1rem"}}>
            <div>
              <p className={'name'}>{name}</p>
              <p className={'type'}>{schema ? 'object' : type}</p>
              <p className={'location'}>{location}</p>
            </div>
            <div>
              { schema ? formatSchema(schema) : <input type={'text'} disabled={true}/> }
            </div>
          </div>
      )
    }

    function formatSchema(schema, key='') {
      const {type, items, additionalProperties, $ref} = schema
  
      if ($ref) return formatRef($ref)
      switch (type) {
        case 'string':
          return <p>String</p>
        case 'array':
          return (<div className={'array-cover'}>{formatSchema(items)}</div>)
        case 'object':
          return (
              <div className={'object-cover'}>
                <div>
                  {
                    Object.keys(additionalProperties).map((property, id) => {
                      return (
                          <div className={'param-item'} key={`${key}-param-${id}`}>
                            <p className={'property-name'}>{property}:</p>
                            {formatSchemaParam(additionalProperties[property])}
                          </div>
                      )
                    })
                  }
                </div>
              </div>
          )
        default:
          return formatSchema(items)
      }
    }
  
    function formatSchemaParam(param) {
      const {type, format} = param
      return <div>{type}, {format}</div>
    }

    function formatRef(ref) {
      const {required, properties} = data.definitions[ref.split('/')[2]]
      return (
          <div className={'object-cover'}>
            <div>
              {
                Object.keys(properties).map(property => {
                  let className = 'param-item '
                  if ((required || []).includes(property))
                    className += 'required '
  
                  return (
                      <div className={className} key={`${property}-param-item`}>
                        <p className={'property-name'}>{property}:</p> {formatSchemaParam(properties[property])}
                      </div>
                  )
                })
              }
            </div>
          </div>
      )
    }

    const [navToggle, setNavToggle] = useState("hidden")

    const toggleBar = useCallback(() => {
      if(navToggle === "collapse navbar-collapse") {
        setNavToggle("hidden")
      } else setNavToggle("collapse navbar-collapse")
    }, [navToggle])
  
    return (
      <div className="App">
        {
          paths &&
          Object.keys(paths).map((path, id) => {
            return (
                <div key={`path-${path}-${id}`}>
                  <p className='text-lg text-slate-900 py-3 px-3 font-bold '>{path}</p>
                  {
                    paths[path].map((routeData) => {
                      const { method, route, parameters, responses } = routeData
                      return (
                          <div className='path py-4 box-content' key={`${method}-${route}`}>
                            <div className={`method ${method} path-address w-full  `}>
                              <p className={`method ${method}`}><button type="button" data-bs-toggle="collapse" data-bs-target="#dropdown" onClick={toggleBar}>{method}</button></p>
                              <p className={'route'}>{route}</p>
                            </div>
                            <div className={navToggle} id='dropdown'>
                              <p className={'parameters-title'}>Parameters</p>
                              <div className={'parameters '}>
                                {
                                  parameters.map(param => formatParam(param, `${method}-${route}`))
                                }
                              </div>
                              <p className={'responses-title'}>Responses</p>
                              <div className={'responses'}>
                                {
                                  Object.keys(responses).map((code, id) => {
                                    const {description, schema} = responses[code]
                                    const key = `${method}-${route}-response-${id}`
                                    return (
                                        <div className={'response'} key={key}>
                                          <p>{code}</p>
                                          <div>{description}</div>
                                          {schema && formatSchema(schema, key)}
                                        </div>
                                    )
                                  })
                                }
                              </div>
                            </div>
                          </div>
                      )
                    })
                  }
                </div>
            )
          })
        }
      </div>
    );
  }
  
  export default PathsList;