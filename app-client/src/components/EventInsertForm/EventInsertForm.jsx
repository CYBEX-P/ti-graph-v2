import React from 'react';
import { Input, Label, Row, Col, Container } from 'reactstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik } from 'formik';
import Button from '../Button/Button';


class EventInsertForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      EventName: "",
      IOCS: [{ data: "", IOCType: "IP" }]
    };
  }

  handleInsert = (actions) => {
    axios.post(`/api/v1/event/start`, this.state);
    //actions.resetForm();
    this.props.dispatchModal(false);
  }

  handleInsertFile = (values, actions) => {
    const formData = new FormData();
    formData.append('file', values.file);
    formData.append('eventName', values.eventName2);
    axios.post(`/api/v1/event/start/file`, formData).then(({ data }) => {
      axios
        .get('/api/v1/neo4j/export')
        .then(({ data }) => {
          this.props.setNeo4jData(data);
        })
        .catch(() => {});
    });

    actions.resetForm();
    this.props.dispatchModal(false);
  }

  handleShareholderDataChange = idx => evt => {
    const newIOCS = this.state.IOCS.map((IOC, sidx) => {
      if (idx !== sidx) return IOC;
      return { ...IOC, data: evt.target.value };
    });

    this.setState({ IOCS: newIOCS });
  };

  handleSubmit = evt => {
    // const { EventName, IOCS } = this.state;
    axios.post('/testAPI', this.state);
  };

  handleAddShareholder = () => {
    this.setState({
      IOCS: this.state.IOCS.concat([{ data: "", IOCType: "IP" }])
    });
  };

  handleRemoveShareholder = idx => () => {
    this.setState({
      IOCS: this.state.IOCS.filter((s, sidx) => idx !== sidx)
    });
  };

  handleEventNameChange = evt => {
    this.setState({
      EventName: evt.target.value
    });
  }

  handleTypeChange = idx => evt => {
    const newIOCS = this.state.IOCS.map((IOC, sidx) => {
      if (idx !== sidx) return IOC;
      return { ...IOC, IOCType: evt.target.value };
    });

    this.setState({ IOCS: newIOCS });
  }

  render() {
    return (
      <Container>
        <form onSubmit={this.handleInsert}>
          <h2>Event Menu</h2>
          <Row>
            <Label>Event Name:</Label>
            <Input
                  type="text"
                  placeholder="Enter Event Name Here"
                  style={{ width: '81%', marginLeft: '15px' }}
                  id="eventNameInput"
                  name="eventName"
                  // value={this.state.EventName}
                  onChange={this.handleEventNameChange}
                />
          </Row>
          <br />

          {this.state.IOCS.map((IOC, idx) => (
            <Row>
              <Col sm={{ size: 4 }} style={{ justifyContent: 'right' }}>
                <select
                  style={{
                    width: '50%',
                    height: '36px',
                    backgroundColor: '#ffffff',
                    color: '#222222',
                    marginTop: 2,
                    justifyContent: 'right'
                  }}
                  name="IOCType"
                  value={IOC.IOCType}
                  onChange={this.handleTypeChange(idx)}
                >
                  {typeof this.props.config !== 'undefined' &&
                    typeof this.props.config.types !== 'undefined' &&
                    this.props.config.types.map(item => (
                      <option value={item} label={item} key={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </Col> 
              <Col md={{ size: 6, offset: 0 }}>
                <Input
                  type="text"
                  placeholder={`IOC Value ${idx + 1}`}
                  value={IOC.data}
                  onChange={this.handleShareholderDataChange(idx)}
                />
              </Col>
            </Row>
        ))}
          <Row>
            <Col sm={{ size: 3 }}>
              <button
                type="button"
                width="58%"
                onClick={this.handleAddShareholder}
                className="small"
              >
                <FontAwesomeIcon size="lg" icon="plus-circle" />
                <div>Add Row</div>
              </button>
            </Col> 
            <Col sm={{ size: 6, offset: 3 }}>
              <Button width="60%" hasIcon type="submit" onClickFunction={() => {}}>
                <div>Start Investigation</div>
              </Button>
            </Col>
          </Row>
        </form>
        <br />
        <br />
        <hr />
        <br />

        {/* Start Event From File */}
        <Formik
          onSubmit={this.handleInsertFile}
          initialValues={{ file: '', eventName2: '' }}
          render={({ values, handleSubmit, setFieldValue, handleChange }) => (
            <form onSubmit={handleSubmit}>
              <Row>
                <Label>Event Name:</Label>
                <Input
                  type="text"
                  placeholder="Enter Event Name Here"
                  style={{ width: '81%', marginLeft: '15px' }}
                  id="eventNameInput"
                  name="eventName2"
                  value={values.eventName2}
                  onChange={handleChange}
                />
              </Row>
              <Row>
                <Col sm={{ size: 3, offset: 3 }}>
                  <Label for="file">File</Label>
                  <Input
                    type="file"
                    name="file"
                    id="file"
                    onChange={event => {
                      setFieldValue('file', event.currentTarget.files[0]);
                    }}
                  />
                </Col>
                <Col sm={{ size: 6, offset: 3 }}>
                  <Button width="60%" hasIcon type="submit" onClickFunction={() => {}}>
                    <div>Start Investigation From File</div>
                  </Button>
                </Col>
              </Row>
            </form>
          )}
        />
      </Container>
    );
  }
}

export default EventInsertForm;