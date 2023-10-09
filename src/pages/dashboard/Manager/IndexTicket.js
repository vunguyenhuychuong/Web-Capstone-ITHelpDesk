


import React from 'react'

const IndexTicket = () => {
  return (
    <section style={{ backgroundColor: "#eee" }}>
    <MDBContainer className="py-5">
    <MDBTable className="align-middle mb-0" responsive>
      <MDBTableHead className="bg-light">
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Category</th>
          <th>Priority</th>
          <th>Processing</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td>
            <div className="d-flex align-items-center">
              <div className="ms-3">
                <p className="fw-bold mb-1">John Doe</p>
                <p className="text-muted mb-0">john.doe@gmail.com</p>
              </div>
            </div>
          </td>
          <td>
            <p className="fw-normal mb-1">Software engineer</p>
            <p className="text-muted mb-0">IT department</p>
          </td>
          <td>
            <span className="badge bg-success rounded-pill">Active</span>
          </td>
          <td>Senior</td>

        </tr>
        {/* Additional rows go here */}
      </MDBTableBody>
    </MDBTable>
    </MDBContainer>
  </section>
  )
}

export default IndexTicket