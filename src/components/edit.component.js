import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { previewImg } from "../utils/image.util";
import { URL_IMAGES } from "../utils/contants";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();

const [car, setCar] = useState({
    nameCar: "",
    price: 0,
    imgLink: "",
    img: null
})
  const [validationError, setValidationError] = useState({});

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    await axios
      .get(`http://localhost:8000/api/cars/${id}`)
      .then(({data}) => {
        console.log(data);
        const {name_car, price, img} = data
        setCar({...car, nameCar: name_car, price, imgLink: img})
      })
      .catch(e => {
        Swal.fire({
          text: e.message,
          icon: "error",
        });
      });
  };

  const changeHandler = (e) => {
    setCar({...car, [e.target.name]: e.target.value})
  }
  const changeImageHandler = (event) => {
    const img = event.target.files[0]
    setCar({...car, img});
    previewImg(img)
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_method", "PATCH");
    formData.append("nameCar", car.nameCar);
    formData.append("price", car.price);
    if (car.img !== null) {
      formData.append("img", car.img);
    }

    await axios
      .post(`http://localhost:8000/api/cars/${id}`, formData)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        });
        navigate("/cars");
      })
      .catch(({ response }) => {
        if (response.status === 422) {
          setValidationError(response.data.errors);
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error",
          });
        }
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Update Product</h4>
              <hr />
              <div className="form-wrapper">
                {Object.keys(validationError).length > 0 && (
                  <div className="row">
                    <div className="col-12">
                      <div className="alert alert-danger">
                        <ul className="mb-0">
                          {Object.entries(validationError).map(
                            ([key, value]) => (
                              <li key={key}>{value}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                <Form onSubmit={updateProduct}>
                  <Row>
                    <Col>
                      <Form.Group controlId="nameCar">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={car.nameCar}
                          name="nameCar"
                          onChange={changeHandler}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col>
                      <Form.Group controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={car.price}
                          name="price"
                          onChange={changeHandler}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="img" className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" onChange={changeImageHandler} />
                      </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <img src={URL_IMAGES + car.imgLink} id="preview-img" alt="" style={{width: "8rem"}} />
                    </Col>
                  </Row>
                  <Button
                    variant="primary"
                    className="mt-2"
                    size="lg"
                    block="block"
                    type="submit"
                  >
                    Update
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
