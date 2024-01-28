import { Component } from 'react';
import cn from 'classnames';
import { withStore, createStore } from 'justorm/react';

import { NODE_TYPES } from 'types/node';

import { Button, Form, Icon, LightBox, SubmitButtons } from '@homecode/ui';

import Editor from 'components/Editor/Editor';
import NodeTypeSelector from 'components/NodeTypeSelector/NodeTypeSelector';

import S from './NodeForm.styl';
import { Tag } from 'components/Editor/embeds/components/Tag';

const TYPE_OPTIONS = Object.values(NODE_TYPES).map(name => ({
  id: name,
  label: name,
}));

const validationSchema = {
  name: { type: 'string', empty: false },
  type: { type: 'string', empty: false },
  data: { type: 'string', empty: false },
  // outputNodeId: { type: 'string' },
};

type Props = {
  id: string;
  className?: string;
  store?: { nodes: any };
};

@withStore({
  nodes: ['items', 'byId', 'selectedId'],
})
export default class NodeForm extends Component<Props> {
  store: any;
  form: any;

  constructor(props) {
    super(props);

    const { name, type, data, outputNodeId } = this.data;

    this.store = createStore(this, {
      currType: type,
      initialValues: {
        name,
        type,
        data,
        outputNodeId,
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

  onTypeChange = val => {
    this.form.setValue('type', val);
  };

  onSave = async () => {
    const { name, type, data } = await this.nodes.updateNode(
      this.props.id,
      this.form.values
    );

    Object.assign(this.store.initialValues, { name, type, data });
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
      variant: 'clean',
      className: S.data,
      controlProps: { style: { minHeight: 100 } },
    };

    switch (this.store.currType) {
      case NODE_TYPES.Function:
        return (
          <Field
            name="data"
            {...props}
            component={Editor}
            showToolbar={false}
          />
        );
      default:
        return <Field name="data" {...props} type="textarea" />;
    }
  };

  renderFooter() {
    const { isValid, isDirty, isLoading, values } = this.form;
    const { outputNodeId, type } = values;
    const isFunction = type === NODE_TYPES.Function;

    if (!isFunction && !isDirty) return;

    return (
      <div className={S.footer}>
        {isFunction ? (
          <Tag
            size="s"
            label={outputNodeId ? 'Output node' : 'Select output node'}
            className={S.outputButton}
            variant="clear"
            // onChange={}
          >
            <Icon type="output" />
            &nbsp;{}
          </Tag>
        ) : (
          <div />
        )}

        {/* <Field name="outputNodeId" size="s" /> */}

        {isDirty && (
          <SubmitButtons
            className={S.submitButtons}
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
        )}

        {isFunction && (
          <Button
            size="s"
            square
            variant="clear"
            className={S.runButton}
            onClick={() => this.nodes.runNode(this.props.id)}
          >
            <Icon type="play" />
          </Button>
        )}
      </div>
    );
  }

  renderFields = form => {
    const { Field, isDirty } = form;

    this.form = form;

    return (
      <>
        <div className={cn(S.header, isDirty && S.changed)}>
          <Field
            name="type"
            size="m"
            label="Type"
            clearMargins
            component={NodeTypeSelector}
            onChange={this.onTypeChange}
          />
          <Field
            name="name"
            size="s"
            clearMargins
            hideRequiredStar
            variant="clean"
            className={S.name}
          />

          <Button size="s" square variant="clear" className={S.link}>
            <Icon type="link" />
          </Button>

          {/* &nbsp; &nbsp;
          <Field
            name="repeatCount"
            size="s"
            className={S.repeat}
            clearMargins
            hideRequiredStar
            label="N to repeat"
            component={Input}
            type="number"
            min={1}
          /> */}

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

        {this.renderFooter()}
      </>
    );
  };

  renderForm = (cls?) => {
    return (
      <Form
        initialValues={{ ...this.store.initialValues }}
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
    const { className } = this.props;
    const type = this.form?.values.type ?? this.data.type;
    const classes = cn(
      S.root,
      type && S[`type-${type.toLowerCase()}`],
      className
    );

    return (
      <div className={cn(classes, S.preview)} onClick={this.onClick}>
        {this.renderForm()}
      </div>
    );

    // TODO: settings.openEditorInFullscreen
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
