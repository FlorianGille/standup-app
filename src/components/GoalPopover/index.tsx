import React from 'react';

import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverContentProps,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';

import { Goal } from '@/app/goals/goal.types';
import { useSpeakers } from '@/app/standup/standup.firebase';

import { FieldInput } from '../FieldInput';
import { FieldSelect } from '../FieldSelect';

interface GoalPopoverProps extends Omit<PopoverContentProps, 'onSubmit'> {
  goal?: Goal;
  onSubmit(values: { description: string; people: string[] }): void;
}

export const GoalPopover: React.FC<GoalPopoverProps> = ({
  children,
  goal,
  onSubmit = () => {},
  ...rest
}) => {
  const internalForm = useForm({ subscribe: { fields: ['input'] } });

  const { data: speakers } = useSpeakers();
  const peopleOptions = speakers?.map((speaker) => ({
    value: speaker?.name,
    label: speaker?.name,
  }));

  const handleSubmit = (values) => {
    onSubmit({
      ...values,
      people: [values?.people],
    });
    onClose();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialFocusRef = React.useRef();

  return (
    <Popover
      colorScheme="gray"
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
    >
      <PopoverTrigger>
        <Box onClick={() => onOpen()}>{children}</Box>
      </PopoverTrigger>
      <Formiz connect={internalForm} autoForm onValidSubmit={handleSubmit}>
        <PopoverContent
          color="gray.100"
          bg="gray.600"
          borderColor="gray.700"
          {...rest}
        >
          <PopoverArrow bg="gray.600" />
          <PopoverCloseButton />
          {isOpen && (
            <>
              <PopoverHeader borderColor="transparent">
                {goal ? 'Editer un objectif' : 'Créer un objectif'}
              </PopoverHeader>
              <PopoverBody>
                <Stack>
                  <FieldInput
                    name="description"
                    label="Description"
                    color="gray.800"
                    ref={initialFocusRef}
                  />
                  <FieldSelect
                    name="people"
                    label="Personnes concernées"
                    options={peopleOptions}
                  />
                </Stack>
              </PopoverBody>
              <PopoverFooter
                borderColor="transparent"
                d="flex"
                justifyContent="flex-end"
              >
                <Button type="submit" variant="@primary" size="sm">
                  {goal ? 'Editer un objectif' : 'Créer un objectif'}
                </Button>
              </PopoverFooter>
            </>
          )}
        </PopoverContent>
      </Formiz>
    </Popover>
  );
};
