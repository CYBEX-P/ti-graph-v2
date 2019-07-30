import React, { useContext } from 'react';
import { Input, Label, Row, Col } from 'reactstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik } from 'formik';
import DataContext from '../App/DataContext';
import Button from '../Button/Button';
import ModalContext from '../App/ModalContext';

const EventInsertForm = props => {
  const { setNeo4jData } = useContext(DataContext);
  const { dispatchModal } = useContext(ModalContext);

  function handleInsertIP(values, actions) {
    props.setEvent(values.eventName);
    if (values.dataToInsert1 !== '') {
      axios.post(`/api/v1/event/start`, values).then(() => {
        axios
          .get('/api/v1/neo4j/export')
          .then(({ data }) => {
            setNeo4jData(data);
          })
          .catch(() => {});
      });
    }
    actions.resetForm();
    dispatchModal(false);
  }

  function handleInsertFile(values, actions) {
    const formData = new FormData();
    formData.append('file', values.file);
    formData.append('eventName', values.eventName2);
    props.setEvent(values.eventName2);
    axios.post(`/api/v1/event/start/file`, formData).then(({ data }) => {
      axios
        .get('/api/v1/neo4j/export')
        .then(({ data }) => {
          setNeo4jData(data);
        })
        .catch(() => {});
    });

    actions.resetForm();
    dispatchModal(false);
  }

  return (
    <>
      <Formik
        onSubmit={handleInsertIP}
        initialValues={{
          dataToInsert1: '',
          IOCType1: 'IP',
          dataToInsert2: '',
          IOCType2: 'IP',
          dataToInsert3: '',
          IOCType3: 'IP'
        }}
        render={({ handleChange, values, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Row>
              <Label>Event Name:</Label>
              <Input
                type="text"
                placeholder="Enter Event Name Here"
                style={{ width: '81%', marginLeft: '15px' }}
                id="eventNameInput"
                name="eventName"
                value={values.eventName}
                onChange={handleChange}
              />
            </Row>
            <br />
            <Row>
              <Col sm={{ size: 4 }} style={{ justifyContent: 'right' }}>
                <select
                  style={{
                    width: '42%',
                    height: '36px',
                    backgroundColor: '#ffffff',
                    color: '#222222',
                    marginTop: 5,
                    justifyContent: 'right'
                  }}
                  name="IOCType1"
                  value={values.IOCType1}
                  id="type-1"
                  onChange={handleChange}
                >
                  {typeof props.config !== 'undefined' &&
                    typeof props.config.types !== 'undefined' &&
                    props.config.types.map(item => (
                      <option value={item} label={item} key={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </Col>
              <Col sm={{ size: 6, offset: 1 }}>
                <Input
                  placeholder="IOC Value"
                  name="dataToInsert1"
                  value={values.dataToInsert1}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={{ size: 4 }} style={{ justifyContent: 'right' }}>
                <select
                  style={{
                    width: '42%',
                    height: '36px',
                    backgroundColor: '#ffffff',
                    color: '#222222',
                    marginTop: 5,
                    justifyContent: 'right'
                  }}
                  name="IOCType2"
                  value={values.IOCType2}
                  id="type-1"
                  onChange={handleChange}
                >
                  {typeof props.config !== 'undefined' &&
                    typeof props.config.types !== 'undefined' &&
                    props.config.types.map(item => (
                      <option value={item} label={item} key={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </Col>
              <Col sm={{ size: 6, offset: 1 }}>
                <Input
                  placeholder="IOC Value"
                  name="dataToInsert2"
                  value={values.dataToInsert2}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={{ size: 4 }} style={{ justifyContent: 'right' }}>
                <select
                  style={{
                    width: '42%',
                    height: '36px',
                    backgroundColor: '#ffffff',
                    color: '#222222',
                    marginTop: 5,
                    justifyContent: 'right'
                  }}
                  name="IOCType3"
                  value={values.IOCType3}
                  id="type-1"
                  onChange={handleChange}
                >
                  {typeof props.config !== 'undefined' &&
                    typeof props.config.types !== 'undefined' &&
                    props.config.types.map(item => (
                      <option value={item} label={item} key={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </Col>
              <Col sm={{ size: 6, offset: 1 }}>
                <Input
                  placeholder="IOC Value"
                  name="dataToInsert3"
                  value={values.dataToInsert3}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm={{ size: 3 }}>
                <Button width="58%" onClickFunction={() => {}}>
                  <div>Add Row</div>
                </Button>
              </Col>

              <Col sm={{ size: 6, offset: 3 }}>
                <Button width="60%" hasIcon type="submit" onClickFunction={() => {}}>
                  <FontAwesomeIcon size="lg" icon="plus-circle" />
                  <div>Start Investigation</div>
                </Button>
              </Col>
            </Row>
          </form>
        )}
      />
      <br />
      <br />
      <hr />
      <br />
      <Formik
        onSubmit={handleInsertFile}
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
    </>
  );
};

export default EventInsertForm;
