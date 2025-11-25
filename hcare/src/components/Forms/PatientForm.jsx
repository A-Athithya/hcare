import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  InputNumber,
  message,
} from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";

const { TextArea } = Input;

const PatientForm = forwardRef(({ initial = null, onSaved = () => {} }, ref) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    submitForm: () => form.submit(),
    resetForm: () => form.resetFields(),
  }));

  useEffect(() => {
    if (initial) {
      const copy = { ...initial };
      if (copy.registeredDate)
        copy.registeredDate = dayjs(copy.registeredDate);
      form.setFieldsValue(copy);
    } else {
      form.resetFields();
    }
  }, [initial, form]);

const submit = async (vals) => {
  try {
    const payload = {
      ...vals,
      registeredDate: vals.registeredDate
        ? vals.registeredDate.format("YYYY-MM-DD")
        : "",
    };

    if (initial?.id) {
      dispatch({
        type: "patients/updateStart",
        payload: { id: initial.id, data: payload },
      });
      message.success("Patient updated");
    } else {
      dispatch({
        type: "patients/createStart",
        payload
      });
      message.success("Patient created");
    }

    onSaved();
  } catch {
    message.error("Save failed");
  }
};

  return (
    <div style={{ paddingRight: 8 }}>
      <Form
        layout="vertical"
        form={form}
        onFinish={submit}
        initialValues={{ gender: "Male", status: "Active" }}
        style={{ marginTop: "-10px" }}   // ⭐ reduce top gap
      >
        <Row gutter={[12, 4]}>  {/* ⭐ Reduced vertical & horizontal spacing */}

          {/* BASIC FIELDS */}
          <Col span={8}>
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]} style={{ marginBottom: 8 }}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="age" label="Age" rules={[{ required: true }]} style={{ marginBottom: 8 }}>
              <InputNumber style={{ width: "100%" }} min={1} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="gender" label="Gender" rules={[{ required: true }]} style={{ marginBottom: 8 }}>
              <Select>
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* CONTACT */}
          <Col span={8}>
            <Form.Item name="contact" label="Contact" rules={[{ required: true }]} style={{ marginBottom: 8 }}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="email" label="Email" style={{ marginBottom: 8 }}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="address" label="Address" style={{ marginBottom: 8 }}>
              <Input />
            </Form.Item>
          </Col>

          {/* PATIENT FIELDS */}
          <Col span={8}>
            <Form.Item name="bloodGroup" label="Blood Group" style={{ marginBottom: 8 }}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="registeredDate" label="Registered Date" style={{ marginBottom: 8 }}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="emergencyContact" label="Emergency Contact" style={{ marginBottom: 8 }}>
              <Input />
            </Form.Item>
          </Col>

          {/* MEDICAL HISTORY LEFT (TALL FIELD) */}
          <Col span={12}>
            <Form.Item name="medicalHistory" label="Medical History"
              style={{ marginBottom: 8 }}
            >
              <TextArea
                style={{
                  height: 33,        // same as normal input height
                  resize: "vertical" // allow manual expand
                }}
              />
            </Form.Item>
          </Col>

          {/* RIGHT SIDE → MAKE IT EVEN */}
          <Col span={12}>
            <Row gutter={[12, 4]}>
              <Col span={24}>
                <Form.Item name="allergies" label="Allergies" style={{ marginBottom: 8 }}>
                  <Input />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="status" label="Status" style={{ marginBottom: 0 }}>
                  <Select>
                    <Select.Option value="Active">Active</Select.Option>
                    <Select.Option value="Inactive">Inactive</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>

        </Row>
      </Form>
    </div>
  );
});

export default PatientForm;
