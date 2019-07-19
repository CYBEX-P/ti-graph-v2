import React, { useContext, useState } from 'react';
import { Formik } from 'formik';
import { Input } from 'reactstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../Button/Button';
import DataContext from '../../App/DataContext';
import ModalContext from '../../App/ModalContext';
import MenuContext from '../../App/MenuContext';

const InsertForm = props => {
  const { neo4jData, setNeo4jData } = useContext(DataContext);
  const { dispatchModal, setError } = useContext(ModalContext);
  const { setLoading } = useContext(MenuContext);

  const [selectedIOC, setSelectedIOC] = useState('IP');
  const [selectedIOC2, setSelectedIOC2] = useState('IP');

  function handleInsertIP(values, actions) {
    const { ipToInsert } = values;
    if (selectedIOC === 'URL' && ipToInsert !== '') {
      axios.post('/api/v1/neo4j/insertURL', {Ntype: "URL", value: `${ipToInsert}`}).then(() => {
        axios
          .get('/api/v1/neo4j/export')
          .then(({ data }) => {
            setNeo4jData(data);
          })
          .catch(() => {});
      });
      actions.resetForm();
    }
    else if (ipToInsert !== '') {
      axios.get(`/api/v1/neo4j/insert/${selectedIOC}/${ipToInsert}`).then(() => {
        axios
          .get('/api/v1/neo4j/export')
          .then(({ data }) => {
            setNeo4jData(data);
          })
          .catch(() => {});
      });
    }
    setSelectedIOC('IP');
    actions.resetForm();
  }

  function handleEnrichIP(values, actions) {
    const { enrichmentType, ipToEnrich } = values;
    if (ipToEnrich !== 'none' && selectedIOC2 === "URL") {
      setLoading(true);
      axios
        .post(`/api/v1/enrichURL`, {value: `${ipToEnrich}`})
        .then(({ data }) => {
          if (data['insert status'] !== 0) {
            axios
              .get('/api/v1/neo4j/export')
              .then(response => {
                setNeo4jData(response.data);
                setLoading(false);
              })
              .catch(() => {
                setError(`${enrichmentType} returned nothing!`);
                dispatchModal('Error');
                setLoading(false);
              });
          } else {
            setError(`${enrichmentType} lookup returned nothing!`);
            dispatchModal('Error');
            setLoading(false);
          }
        })
        .catch(() => {
          setError(`${enrichmentType} returned nothing!`);
          dispatchModal('Error');
          setLoading(false);
        });
    }
    else if (ipToEnrich !== 'none') {
      setLoading(true);
      axios
        .get(`/api/v1/enrich/${enrichmentType}/${ipToEnrich}`)
        .then(({ data }) => {
          if (data['insert status'] !== 0) {
            axios
              .get('/api/v1/neo4j/export')
              .then(response => {
                setNeo4jData(response.data);
                setLoading(false);
              })
              .catch(() => {
                setError(`${enrichmentType} returned nothing!`);
                dispatchModal('Error');
                setLoading(false);
              });
          } else {
            setError(`${enrichmentType} lookup returned nothing!`);
            dispatchModal('Error');
            setLoading(false);
          }
        })
        .catch(() => {
          setError(`${enrichmentType} returned nothing!`);
          dispatchModal('Error');
          setLoading(false);
        });
    }
    actions.setSubmitting(false);
  }

  return (
    <>
      {/* Insert data */}
      <Formik
        onSubmit={handleInsertIP}
        initialValues={{ ipToInsert: '', IOCType: 'IP' }}
        render={({ handleChange, errors, values, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <select
              style={{ width: '100%', height: '36px', backgroundColor: '#ffffff', color: '#222222' }}
              name="IOCType"
              value={values.IOCType}
              onChange={e => {
                handleChange(e);
                setSelectedIOC(e.target.value);
              }}
            >
              {typeof props.config !== 'undefined' &&
                typeof props.config.types !== 'undefined' &&
                props.config.types.map(item => (
                  <option value={item} label={item} key={item}>
                    {item}
                  </option>
                ))}
            </select>

            <Input placeholder="Data Value" name="ipToInsert" value={values.ipToInsert} onChange={handleChange} />
            <Button width="100%" hasIcon type="submit" onClickFunction={() => {}}>
              <FontAwesomeIcon size="lg" icon="plus-circle" />
              <div>Insert IOC</div>
            </Button>
            <div style={{ color: '#ff4500' }}>{errors.ipToInsert}</div>
          </form>
        )}
      />

      {/* Enrichments */}

      {/* selectedIOC2 select */}
      <Formik
        onSubmit={handleEnrichIP}
        initialValues={{ ipToEnrich: 'none', enrichmentType: 'none' }}
        render={({ values, handleChange, handleSubmit }) => (

          <form onSubmit={handleSubmit}>
            <select
              style={{ width: '100%', height: '36px', backgroundColor: '#ffffff', color: '#222222' }}
              name="IOCType"
              value={values.IOCType}
              onChange={e => {
                handleChange(e);
                setSelectedIOC2(e.target.value);
              }}
            >
              {typeof props.config !== 'undefined' &&
                typeof props.config.types !== 'undefined' &&
                props.config.types.map(item => (
                  <option value={item} label={item} key={item}>
                    {item}
                  </option>
                ))}
            </select>

            {/* Enrichment type select */}
            <select
              style={{ width: '30%', height: '36px', backgroundColor: '#ffffff', color: '#222222' }}
              name="enrichmentType"
              value={values.enrichmentType}
              onChange={handleChange}
            >
              {typeof props.config !== 'undefined' &&
                typeof props.config.enrichments !== 'undefined' &&
                props.config.enrichments[selectedIOC2].map(item => (
                  <option value={item} label={item} key={item}>
                    {item}
                  </option>
                ))}
            </select>
            
            {/* data select */}
            <select
              style={{ width: '70%', height: '36px', color: '#222222', backgroundColor: '#ffffff' }}
              name="ipToEnrich"
              value={values.ipToEnrich}
              onChange={handleChange}
            >
              <option value="none">None</option>
              {neo4jData &&
                neo4jData.Neo4j[0].map(({ nodes }) =>
                  nodes.filter(node => node.label === selectedIOC2)
                  .map(({ label, properties, id }) => {
                    return (
                      properties.data && label && (
                        <option key={id} value={properties.data} label={properties.data}>
                          {properties.data}
                        </option>
                      )
                    );
                  })
                )}
            </select>
            <Button width="100%" type="submit" onClickFunction={() => {}}>
              Enrich IOC
            </Button>
          </form>
        )}
      />
    </>
  );
};

export default InsertForm;
