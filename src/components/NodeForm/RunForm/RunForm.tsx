import { useMemo, useRef, useState } from 'react';
import { Form, Button, ButtonGroup, Icon, Select } from '@homecode/ui';
import { withStore } from 'justorm/react';
import cn from 'classnames';

import S from './RunForm.styl';

const validateSchema = {
  model: { type: 'string', empty: false },
  prePrompt: { type: 'string' },
};

const DEFAULT_PRE_PROMPT = `You are a chatbot. Respond with short, clear messages.
USER: {prompt}
ASSISTANT:`;

export default withStore({
  app: 'models',
  runs: '',
})(
  ({
    id,
    store: {
      runs,
      app: { models },
    },
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleForm = () => setIsOpen(!isOpen);

    const formRef = useRef(null);

    const initialValues = useMemo(
      () => ({
        model: models[0],
        prePrompt: DEFAULT_PRE_PROMPT,
      }),
      [models]
    );

    const modelsOptions = useMemo(
      () => models.map(name => ({ id: name, label: name })),
      [models]
    );

    const onRun = () => {
      const { model } = formRef.current.values;

      runs.runNode(id, { model });
    };

    const renderForm = form => {
      const { Field } = form;

      formRef.current = form;

      return (
        <>
          <div className={S.form}>
            <Field
              popupProps={{ className: S.field }}
              triggerProps={{ className: S.selectTrigger }}
              name="model"
              label="Model"
              fulllWidth
              component={Select}
              size="s"
              required
              options={modelsOptions}
              elevation={1}
            />
            <Field
              name="prePrompt"
              label="Pre-prompt"
              type="textarea"
              size="s"
            />
          </div>
          <ButtonGroup className={S.footer}>
            <Button
              size="s"
              square
              onClick={toggleForm}
              variant={isOpen ? 'primary' : 'default'}
            >
              <Icon type="gear" />
            </Button>
            <Button
              size="s"
              // square
              // className={S.runButton}
              // loading={this.runs.byNodeId[id]?.isLoading}
              onClick={onRun}
            >
              Run
              {/* <Icon type="play" /> */}
            </Button>
          </ButtonGroup>
        </>
      );
    };

    return (
      <Form
        initialValues={initialValues}
        validationSchema={validateSchema}
        className={cn(S.root, isOpen && S.opened)}
      >
        {renderForm}
      </Form>
    );
  }
);
