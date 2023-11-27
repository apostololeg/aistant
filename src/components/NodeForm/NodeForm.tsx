import cn from 'classnames';
import { withStore, createStore } from 'justorm/react';

import type { Node } from 'types/node';
import { NODE_TYPES } from 'types/node';

import S from './NodeForm.styl';
import {
  Button,
  Form,
  Icon,
  Input,
  LightBox,
  Paranja,
  Select,
  SubmitButtons,
} from '@homecode/ui';
import Editor from 'components/Editor/Editor';
import { Component } from 'react';

const TYPE_OPTIONS = Object.values(NODE_TYPES).map(name => ({
  id: name,
  label: name,
}));

const validationSchema = {
  name: { type: 'string', empty: false },
  type: { type: 'string', empty: false },
  data: { type: 'string', empty: false },
  repeatCount: { type: 'number' },
};

type Props = {
  id: string;
  className?: string;
  store: { nodes: any };
};

@withStore({
  nodes: ['items', 'byId', 'selectedId'],
})
export default class NodeForm extends Component<Props> {
  store: any;
  form: any;

  constructor(props) {
    super(props);

    const { name, type, data, repeatCount } = this.data;

    this.store = createStore(this, {
      currType: type,
      initialValues: {
        name,
        type,
        data,
        repeatCount,
      },
    });
  }

  componentDidMount() {
    document.addEventListener('keydow', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydow', this.onKeyDown);
  }

  get nodes() {
    return this.props.store.nodes;
  }

  get data() {
    const { id } = this.props;
    const { byId } = this.nodes;
    return byId[id] ?? {};
  }

  onClick = e => {
    // set edit mode on double click
    if (e.detail === 2) {
      this.nodes.setSelected(this.props.id);
    }
  };

  onSave = async () => {
    await this.nodes.updateNode(this.props.id, this.form.values);
    this.nodes.setSelected(null);
  };

  onKeyDown = e => {
    // ESC
    if (e.keyCode === 27) {
      this.nodes.setSelected(null);
    }

    // Ctlr + S
    if (e.keyCode === 83 && e.ctrlKey) {
      e.preventDefault();
      this.onSave();
    }
  };

  renderDataField = ({ Field }) => {
    const props = {
      hideRequiredStar: true,
      name: 'data',
      label: 'Data',
      className: S.data,
      controlProps: { style: { minHeight: 100 } },
    };

    switch (this.store.currType) {
      case NODE_TYPES.Function:
        return <Field {...props} component={Editor} />;
      default:
        return <Field {...props} type="textarea" />;
    }
  };

  renderFields = form => {
    const { Field, isValid, isDirty, isLoading } = form;

    this.form = form;

    return (
      <>
        <div className={cn(S.header, isDirty && S.changed)}>
          <Field
            hideRequiredStar
            name="name"
            label="Name"
            className={S.name}
            // value={this.props.name}
            size="s"
          />
          &nbsp;
          <Field
            hideRequiredStar
            name="type"
            label="Type"
            size="s"
            clearMargins
            component={props => <Select {...props} className={S.type} />}
            // value={this.props.name}
            options={TYPE_OPTIONS}
            onChange={(e, val) => this.setState({ currType: val })}
          />
          &nbsp;
          <Field
            className={S.repeat}
            clearMargins
            name="repeatCount"
            size="s"
            hideRequiredStar
            label="N to repeat"
            component={Input}
            type="number"
            // value={this.props.name}
            min={1}
            // onChange={(e, val) => setRepeatCount(val)}
          />
          <Button className={S.outputButton} variant="clear">
            <Icon type="output" />
          </Button>
          {/* TODO: calendar, cron job */}
          {/* <Button
        variant="clear"
        onClick={() => setRepeatOpen(true)}
        className={S.repeatButton}
      >
        <Icon type="repeat" />
      </Button> */}
        </div>

        {this.renderDataField({ Field })}

        <SubmitButtons
          buttons={[
            {
              key: 'submit',
              children: 'Save',
              variant: 'primary',
              type: 'submit',

              size: 's',
              disabled: !isValid || !isDirty,
              loading: isLoading,
            },
          ]}
        />
      </>
    );
  };

  renderForm = (cls?) => {
    return (
      <Form
        initialValues={this.store.initialValues}
        validationSchema={validationSchema}
        className={cls}
        onSubmit={this.onSave}
      >
        {form => this.renderFields(form)}
      </Form>
    );
  };

  renderDataView = () => {
    switch (this.store.currType) {
      case NODE_TYPES.Function:
        return <Editor value={this.data} readOnly />;
      default:
        return <div className={S.data}>{this.data.data}</div>;
    }
  };

  render() {
    const { id, className } = this.props;
    const { currType } = this.store;
    const classes = cn(S.root, S[`type-${currType.toLowerCase()}`], className);

    if (id !== this.nodes.selectedId) {
      return (
        <div className={cn(classes, S.preview)} onClick={this.onClick}>
          {/* <div className={S.header}>
              {<div className={S.name}>{name}</div>}
              <Button
                variant="clear"
                onClick={() => nodes.setSelected(id)}
                className={S.editButton}
              >
                <Icon type="edit" />
              </Button>
            </div> */}
          {/* {renderDataView()} */}
          {this.renderForm()}
        </div>
      );
    }

    return (
      <LightBox
        className={S.editor}
        isOpen
        blur
        onClose={() => this.nodes.setSelected(null)}
      >
        {this.renderForm(classes)}
      </LightBox>
    );
  }
}
