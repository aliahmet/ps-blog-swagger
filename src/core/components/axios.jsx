import React, { Component } from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import Im from "immutable"

// More readable, just iterate over maps, only
const eachMap = (iterable, fn) => iterable.valueSeq().filter(Im.Map.isMap).map(fn)

export default class Axios extends Component {

  static propTypes = {
    parameters: ImPropTypes.list.isRequired,
    specActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    fn: PropTypes.object.isRequired,
    tryItOutEnabled: PropTypes.bool,
    allowTryItOut: PropTypes.bool,
    onTryoutClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    onChangeKey: PropTypes.array,
    pathMethod: PropTypes.array.isRequired,
    getConfigs: PropTypes.func.isRequired
  }


  static defaultProps = {
    onTryoutClick: Function.prototype,
    onCancelClick: Function.prototype,
    tryItOutEnabled: false,
    allowTryItOut: true,
    onChangeKey: [],
  }

  onChange = ( param, value, isXml ) => {
    let {
      specActions: { changeParam },
      onChangeKey,
    } = this.props

    changeParam( onChangeKey, param.get("name"), param.get("in"), value, isXml)
  }

  onChangeConsumesWrapper = ( val ) => {
    let {
      specActions: { changeConsumesValue },
      onChangeKey
    } = this.props

    changeConsumesValue(onChangeKey, val)
  }

  render(){

    let {
      onTryoutClick,
      onCancelClick,
      parameters,
      allowTryItOut,
      tryItOutEnabled,

      fn,
      getComponent,
      getConfigs,
      specSelectors,
      pathMethod
    } = this.props

    const ParameterRow = getComponent("parameterRow")
    const TryItOutButton = getComponent("TryItOutButton")

    const isExecute = tryItOutEnabled && allowTryItOut

    const method = pathMethod[1];
    const path_parameters = eachMap(parameters.filter(function(parameter){
                  return parameter.get( "in" ) == "path";
                }), (parameter) => parameter.get("name")).toArray().join(", ");
    const body_parameters = eachMap(parameters.filter(function(parameter){
                  return parameter.get( "in" ) == "body";
                }), (parameter) => parameter.get("name")).toArray();
    const parameter_names = eachMap(parameters, (parameter) => parameter.get("name")).toArray().join(", ");
    let dict = []
    body_parameters.forEach(function(parameter) {
      dict.push(parameter.get("name") + ":" + parameter.get("name"))
    }, this);
    dict = " {" + dict.join(", ") + "};"

    const methods_with_payload = ["put", "patch", "post"];

    const full_url = ("base + " + pathMethod[0].replace("{", "' + ").replace("}", " + '") + "'").replace("'' + ","").replace(" + ''","") ;
    return (
      <div className="opblock-section">
        <div className="opblock-section-header">
          <div className="tab-header">
            <h4 className="opblock-title">Axios</h4>
          </div>
            
        </div>
        {
          <div className="table-container">
            <pre><code>
              // Action <br/>
              export function nameToApiEndpoint({path_parameters}) {'{'}
              <br />
              {"  return "}{full_url}{";"}
              <br />
              {'}'}
              <br /><br />

              {"export function NAME_TO_ACTION("}{parameter_names}{") {"} <br />
              {"  return dispatch => {"} <br />
              {"    const url= api.nameToApiEndpoint("}{path_parameters}{");"} <br />
              { methods_with_payload.indexOf(method) > -1 ? "    const formData=" + dict : ""}<br />
              {"    Rx.Observable.fromPromise(axios."}{method}{ methods_with_payload.indexOf(method) > -1 ?  "(url, formData, config) " : "(url, config) "} <br />
              {"      .then(response => {"} <br />
              {"        dispatch({"} <br />
              {"          payload: {"} <br />
              {"            // do stuff with `response`"} <br />
              {"          }"} <br />
              {"        })"} <br />
              {"      })"} <br />
              {"      .catch(error => {"} <br />
              {"            // do stuff with `error`"} <br />
              {"      });"} <br />
              {"  }"} <br />
              {"}"} <br />
              
              <br />
              <br />
              
                
                </code></pre>
          </div>
        }
      </div>
    )
  }
}
