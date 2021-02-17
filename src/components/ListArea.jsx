import React, { useState } from 'react';
import axios from 'axios';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { ListGroup } from 'react-bootstrap';


function ListArea(props) {

  const [postItemUrl, setPostItemUrl] = useState('');


  function handleItemChange(e) {
    props.setInputActive(true);
    props.setItemTitle(e.target.value);
    setPostItemUrl(escape(props.clickedListID));
  }

  function handleItemSubmit(e) {
    e.preventDefault();
    //add new item

    if (props.editItemUrl === '' && postItemUrl !== '' && props.itemTitle !== '') {
      axios.post('lists/' + postItemUrl + '/items',
        {
          title: props.itemTitle
        })
        .catch(function (error) {
          console.log(error);
        })
        .then((response) => {
          props.setListItems([...response.data.items]);
          props.setItemTitle('');
          setPostItemUrl('');
          props.setInputActive(false);
        });
    } else if (props.editItemUrl !== '') {

      axios.patch('lists/' + props.editItemUrl,
        {
          title: props.itemTitle
        })
        .catch(function (error) {
          console.log(error);
        })
        .then((response) => {
          console.log(response);
          if (response.data !== 'Can not find item') {
            props.setListItems([...response.data[0].items]);
            props.setEditItemUrl('');
            props.setItemTitle('');
            props.setInputActive(false);
          }

        });
    }
  }

  function handleEditItem(e) {
    handleItemChange(e);
    props.setEditItemUrl(escape(props.clickedListID + "/items/" + e.target.name));
  }

  function handleDeleteItem(e) {
    let deleteItemUrl = escape(props.clickedListID + "/items/" + e.target.name);
    //delete specific Item
    if (deleteItemUrl !== '') {
      axios.delete('lists/' + deleteItemUrl)
        .catch(function (error) {
          console.log(error);
        })
        .then((response) => {
          props.setListItems([...response.data.items]);
          props.setItemTitle('');
          props.setEditItemUrl('');
        });
    }
  }

  function handleDeleteAllItems() {

    axios.patch('lists/' + escape(props.clickedListID) + '/items')
      .catch(function (error) {
        console.log(error);
      })
      .then((response) => {
        props.setListItems([...response.data.items]);
        props.setEditItemUrl('');
        props.setItemTitle('');
      });
  }
  return <div style={props.clickedListTitle === '' ? { display: 'none' } : { display: 'block' }}>
    <h2 className="d-inline-block mb-lg-4 text-secondary p-2 pl-4 pr-4 rounded">{props.clickedListTitle}</h2>
    <ListGroup className="mb-3">
      <ListGroup.Item style={props.listItems.length !== 0 ? { display: 'none' } : { display: 'block', height: '4rem', padding: '6px 12px' }}></ListGroup.Item>

      {props.listItems.map((item, index) => {


        return <ListGroup.Item className={index === 0 ? "border-top rounded-top list-group-item pt-3" : "list-group-item"} key={index}>
          <Row className="d-xl-none mb-3 ml-xl-0">
            <span className="title" style={{ padding: '6px 12px', marginRight: '1rem', fontSize: '1.1rem' }}>{item.title}</span>
          </Row>
          <Row >
            <Col className="d-none d-xl-block">
              <span className="title" style={{ padding: '6px 12px', marginRight: '1rem', fontSize: '1.1rem' }}>{item.title}</span>
            </Col>
            <Col style={{ maxWidth: '10rem' }}>
              {props.inputActive ?
                <button className="w-100 btn btn-outline-primary" name={item._id} value={item.title} onClick={handleEditItem} disabled>edit</button> :
                <button className="w-100 btn btn-outline-primary" name={item._id} value={item.title} onClick={handleEditItem}>edit</button>}
            </Col>
            <Col style={{ maxWidth: '10rem' }}>
              {props.inputActive ?
                <button className="w-100 btn btn-outline-primary" name={item._id} value={item.title} onClick={handleDeleteItem} disabled>delete</button> :
                <button className="w-100 btn btn-outline-primary" name={item._id} value={item.title} onClick={handleDeleteItem}>delete</button>}
            </Col>
          </Row>
        </ListGroup.Item>
      })}
    </ListGroup>
    <form className="list-background rounded" style={{ paddingRight: '1.3rem', padding: '1rem' }} onSubmit={handleItemSubmit}>
      <Row className="mb-2">
        <Col >
          <input style={{ border: '1.5px solid lightBlue', fontSize: '1.1rem' }} className=" w-100 mb-2 p-2" type="text" onChange={handleItemChange} value={props.itemTitle} placeholder="add new item" />
        </Col>
        <Col className="d-none d-xl-block" style={{ maxWidth: '10rem' }} >
          <button className="btn btn-outline-primary w-100" type="submit">ok</button>
        </Col>
        <Col className="d-none d-xl-block" style={{ maxWidth: '10rem' }}>
          {props.inputActive ?
            <button className=" btn btn-outline-primary w-100" onClick={handleDeleteAllItems} disabled> delete all</button> :
            <button className=" btn btn-outline-primary w-100" onClick={handleDeleteAllItems}> delete all</button>}
        </Col>
      </Row>

      <Row className="d-xl-none ">
        <Col style={{ maxWidth: '10rem' }}>
          <button className="btn btn-outline-primary w-100" type="submit">ok</button>
        </Col>
        <Col style={{ maxWidth: '10rem' }}>
        {props.inputActive ?
            <button className=" btn btn-outline-primary w-100" onClick={handleDeleteAllItems} disabled> delete all</button> :
            <button className=" btn btn-outline-primary w-100" onClick={handleDeleteAllItems}> delete all</button>}
        </Col>
      </Row>

    </form>

  </div>
}

export default ListArea;