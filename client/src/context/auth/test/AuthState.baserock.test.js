import { jest } from '@jest/globals';
import React from 'react';
import { render, act } from '@testing-library/react';
import AuthState from '../../../../src/context/auth/AuthState';
import AuthContext from '../../../../src/context/auth/authContext';
import * as types from '../../../../src/context/types';

// Mock dependencies
jest.mock('axios');
jest.mock('../../../../src/utils/setAuthToken');

// Import mocked modules
import axios from 'axios';
import setAuthToken from '../../../../src/utils/setAuthToken';

const mockDispatch = jest.fn();
jest.spyOn(React, 'useReducer').mockImplementation(() => [{}, mockDispatch]);

describe('AuthState Component', () => {
  let wrapper;
  let contextValue;
  
  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = render(
      <AuthState>
        <AuthContext.Consumer>
          {(context) => {
            contextValue = context;
            return <div>{JSON.stringify(context)}</div>;
          }}
        </AuthContext.Consumer>
      </AuthState>
    );
  });

  it('should initialize with correct initial state', () => {
    expect(contextValue.token).toBe(localStorage.getItem('token'));
    expect(contextValue.isAuthenticated).toBeNull();
    expect(contextValue.loading).toBe(true);
    expect(contextValue.user).toBeNull();
    expect(contextValue.error).toBeNull();
  });

  it('should load user successfully', async () => {
    const mockUser = { id: '1', name: 'Test User' };
    axios.get.mockResolvedValue({ data: mockUser });

    await act(async () => {
      await contextValue.loadUser();
    });

    expect(setAuthToken).toHaveBeenCalledWith(localStorage.getItem('token'));
    expect(axios.get).toHaveBeenCalledWith('/api/auth');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.USER_LOADED,
      payload: mockUser
    });
  });

  it('should handle auth error when loading user', async () => {
    axios.get.mockRejectedValue(new Error('Auth Error'));

    await act(async () => {
      await contextValue.loadUser();
    });

    expect(mockDispatch).toHaveBeenCalledWith({ type: types.AUTH_ERROR });
  });

  it('should register user successfully', async () => {
    const mockFormData = { name: 'Test User', email: 'test@test.com', password: 'password123' };
    const mockResponse = { data: { token: 'mockToken' } };
    axios.post.mockResolvedValue(mockResponse);

    await act(async () => {
      await contextValue.register(mockFormData);
    });

    expect(axios.post).toHaveBeenCalledWith('/api/users', mockFormData, expect.any(Object));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.REGISTER_SUCCESS,
      payload: mockResponse.data
    });
  });

  it('should handle registration failure', async () => {
    const mockFormData = { name: 'Test User', email: 'test@test.com', password: 'password123' };
    const mockError = { response: { data: { msg: 'Registration failed' } } };
    axios.post.mockRejectedValue(mockError);

    await act(async () => {
      await contextValue.register(mockFormData);
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.REGISTER_FAIL,
      payload: mockError.response.data.msg
    });
  });

  it('should login user successfully', async () => {
    const mockFormData = { email: 'test@test.com', password: 'password123' };
    const mockResponse = { data: { token: 'mockToken' } };
    axios.post.mockResolvedValue(mockResponse);

    await act(async () => {
      await contextValue.login(mockFormData);
    });

    expect(axios.post).toHaveBeenCalledWith('/api/auth', mockFormData, expect.any(Object));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.LOGIN_SUCCESS,
      payload: mockResponse.data
    });
  });

  it('should handle login failure', async () => {
    const mockFormData = { email: 'test@test.com', password: 'password123' };
    const mockError = { response: { data: { msg: 'Invalid credentials' } } };
    axios.post.mockRejectedValue(mockError);

    await act(async () => {
      await contextValue.login(mockFormData);
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.LOGIN_FAIL,
      payload: mockError.response.data.msg
    });
  });

  it('should logout user', () => {
    contextValue.logout();
    expect(mockDispatch).toHaveBeenCalledWith({ type: types.LOGOUT });
  });

  it('should clear errors', () => {
    contextValue.clearErrors();
    expect(mockDispatch).toHaveBeenCalledWith({ type: types.CLEAR_ERRORS });
  });
});