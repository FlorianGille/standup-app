import React, { useEffect, useRef, useState } from 'react';

import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Flex,
  Text,
  useClipboard,
  Button,
  Portal,
} from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';
import { FiCheck, FiCopy, FiLogOut } from 'react-icons/fi';

import appBuild from '@/../app-build.json';
import { useAuth } from '@/app/auth/useAuth';
import { Icon } from '@/components';

const AppVersion = ({ ...rest }) => {
  const { hasCopied, onCopy } = useClipboard(JSON.stringify(appBuild, null, 2));

  if (!appBuild?.version) {
    return null;
  }

  return (
    <>
      <MenuDivider />
      <Flex
        role="group"
        as="button"
        position="relative"
        w="full"
        textAlign="left"
        py="2"
        px="3"
        my="-2"
        fontSize="0.7rem"
        fontWeight="medium"
        bg="white"
        color="gray.400"
        outline="none"
        _hover={{ bg: 'gray.50', color: 'gray.500' }}
        _focus={{ bg: 'gray.50', color: 'gray.500' }}
        onClick={onCopy}
        {...rest}
      >
        <Flex
          d={hasCopied ? 'flex' : 'none'}
          position="absolute"
          align="center"
          top="0"
          left="0"
          right="0"
          bottom="0"
          py="2"
          px="3"
          fontWeight="bold"
          bg="white"
          color={hasCopied ? 'success.500' : undefined}
          transition="0.2s"
          _groupHover={{ d: 'flex' }}
        >
          <Icon icon={hasCopied ? FiCheck : FiCopy} mr="2" fontSize="sm" />
          {hasCopied ? 'Version copiée' : 'Copier la version'}
        </Flex>
        <Text as="span" noOfLines={2}>
          Version <strong>{appBuild?.display ?? appBuild?.version}</strong>
        </Text>
      </Flex>
    </>
  );
};

export const AccountMenu = ({ ...rest }) => {
  const { signInWithGoogle, signOut, onAuthStateChanged } = useAuth();

  const [user, setUser] = useState(null);

  const onAuthStateChangedRef = useRef<any>();
  onAuthStateChangedRef.current = onAuthStateChanged;

  useEffect(() => {
    onAuthStateChangedRef.current(setUser);
  }, []);

  if (!user) {
    return (
      <Button
        variant="@primary"
        leftIcon={<FaGoogle />}
        onClick={() => signInWithGoogle()}
        size="sm"
      >
        Se connecter
      </Button>
    );
  }

  return (
    <Menu placement="bottom-end" {...rest}>
      <MenuButton borderRadius="full" _focus={{ shadow: 'outline' }}>
        {user && (
          <Avatar size="sm" name={user?.username} src={user?.photoURL} />
        )}
      </MenuButton>
      <Portal>
        <MenuList color="gray.800" maxW="12rem" overflow="hidden" zIndex="10">
          <MenuGroup title={user?.username} pb={1} />
          <MenuDivider />
          <MenuItem
            icon={<Icon icon={FiLogOut} fontSize="lg" color="gray.400" />}
            onClick={() => signOut()}
          >
            Se déconnecter
          </MenuItem>
          <AppVersion />
        </MenuList>
      </Portal>
    </Menu>
  );
};
