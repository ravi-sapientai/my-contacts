import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import React from 'react';
import { render, act } from '@testing-library/react';
import ContactState from '../../../../../client/src/context/contact/ContactState';
import ContactContext from '../../../../../client/src/context/contact/contactContext';
import * as types from '../../../../../client/src/context/types';

// Mock axios
jest.unstable_mockModule('axios', () => ({
  default: {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
  },
}));

const axios = (await import('axios')).default;

describe('ContactState', () => {
  let wrapper;
  let useReducerSpy;

  beforeEach(() => {
    useReducerSpy = jest.spyOn(React, 'useReducer');
    useReducerSpy.mockImplementation((reducer, initialState) => [initialState, jest.fn()]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct initial state', () => {
    wrapper = render(<ContactState>{({ contacts, current, filtered, error }) => 
      <div data-testid="state">
        {JSON.stringify({ contacts, current, filtered, error })}
      </div>
    }</ContactState>);

    const stateElement = wrapper.getByTestId('state');
    expect(JSON.parse(stateElement.textContent)).toEqual({
      contacts: null,
      current: null,
      filtered: null,
      error: null,
    });
  });

  it('should add a contact', async () => {
    const mockContact = { name: 'John Doe', email: 'john@example.com' };
    const mockResponse = { data: { ...mockContact, _id: '123' } };
    axios.post.mockResolvedValue(mockResponse);

    wrapper = render(
      <ContactState>
        {({ addContact }) => <button onClick={() => addContact(mockContact)}>Add Contact</button>}
      </ContactState>
    );

    await act(async () => {
      wrapper.getByText('Add Contact').click();
    });

    expect(axios.post).toHaveBeenCalledWith('/api/contacts', mockContact, {
      headers: { 'Content-Type': 'application/json' },
    });
    expect(useReducerSpy.mock.calls[1][0]).toEqual({
      type: types.ADD_CONTACT,
      payload: mockResponse.data,
    });
  });

  it('should get contacts', async () => {
    const mockContacts = [{ _id: '1', name: 'John' }, { _id: '2', name: 'Jane' }];
    axios.get.mockResolvedValue({ data: mockContacts });

    wrapper = render(
      <ContactState>
        {({ getContacts }) => <button onClick={getContacts}>Get Contacts</button>}
      </ContactState>
    );

    await act(async () => {
      wrapper.getByText('Get Contacts').click();
    });

    expect(axios.get).toHaveBeenCalledWith('/api/contacts');
    expect(useReducerSpy.mock.calls[1][0]).toEqual({
      type: types.GET_CONTACTS,
      payload: mockContacts,
    });
  });

  it('should delete a contact', async () => {
    const contactId = '123';
    axios.delete.mockResolvedValue({});

    wrapper = render(
      <ContactState>
        {({ deleteContact }) => <button onClick={() => deleteContact(contactId)}>Delete Contact</button>}
      </ContactState>
    );

    await act(async () => {
      wrapper.getByText('Delete Contact').click();
    });

    expect(axios.delete).toHaveBeenCalledWith(`/api/contacts/${contactId}`);
    expect(useReducerSpy.mock.calls[1][0]).toEqual({
      type: types.DELETE_CONTACT,
      payload: contactId,
    });
  });

  it('should update a contact', async () => {
    const mockContact = { _id: '123', name: 'John Doe', email: 'john@example.com' };
    const mockResponse = { data: mockContact };
    axios.put.mockResolvedValue(mockResponse);

    wrapper = render(
      <ContactState>
        {({ updateContact }) => <button onClick={() => updateContact(mockContact)}>Update Contact</button>}
      </ContactState>
    );

    await act(async () => {
      wrapper.getByText('Update Contact').click();
    });

    expect(axios.put).toHaveBeenCalledWith(`/api/contacts/${mockContact._id}`, mockContact, {
      headers: { 'Content-Type': 'application/json' },
    });
    expect(useReducerSpy.mock.calls[1][0]).toEqual({
      type: types.UPDATE_CONTACT,
      payload: mockResponse.data,
    });
  });

  it('should set current contact', () => {
    const mockContact = { _id: '123', name: 'John Doe' };

    wrapper = render(
      <ContactState>
        {({ setCurrent }) => <button onClick={() => setCurrent(mockContact)}>Set Current</button>}
      </ContactState>
    );

    act(() => {
      wrapper.getByText('Set Current').click();
    });

    expect(useReducerSpy.mock.calls[1][0]).toEqual({
      type: types.SET_CURRENT,
      payload: mockContact,
    });
  });

  it('should clear current contact', () => {
    wrapper = render(
      <ContactState>
        {({ clearCurrent }) => <button onClick={clearCurrent}>Clear Current</button>}
      </ContactState>
    );

    act(() => {
      wrapper.getByText('Clear Current').click();
    });

    expect(useReducerSpy.mock.calls[1][0]).toEqual({
      type: types.CLEAR_CURRENT,
    });
  });

  it('should filter contacts', () => {
    const filterText = 'John';

    wrapper = render(
      <ContactState>
        {({ filterContacts }) => <button onClick={() => filterContacts(filterText)}>Filter Contacts</button>}
      </ContactState>
    );

    act(() => {
      wrapper.getByText('Filter Contacts').click();
    });

    expect(useReducerSpy.mock.calls[1][0]).toEqual({
      type: types.FILTER_CONTACTS,
      payload: filterText,
    });
  });

  it('should clear filter', () => {
    wrapper = render(
      <ContactState>
        {({ clearFilter }) => <button onClick={clearFilter}>Clear Filter</button>}
      </ContactState>
    );

    act(() => {
      wrapper.getByText('Clear Filter').click();
    });

    expect(useReducerSpy.mock.calls[1][0]).toEqual({
      type: types.CLEAR_FILTER,
    });
  });

  it('should clear contacts', () => {
    wrapper = render(
      <ContactState>
        {({ clearContacts }) => <button onClick={clearContacts}>Clear Contacts</button>}
      </ContactState>
    );

    act(() => {
      wrapper.getByText('Clear Contacts').click();
    });

    expect(useReducerSpy.mock.calls[1][0]).toEqual({
      type: types.CLEAR_CONTACTS,
    });
  });

  it('should handle contact error', async () => {
    const errorMessage = 'An error occurred';
    axios.post.mockRejectedValue({ response: { msg: errorMessage } });

    wrapper = render(
      <ContactState>
        {({ addContact }) => <button onClick={() => addContact({})}>Add Contact</button>}
      </ContactState>
    );

    await act(async () => {
      wrapper.getByText('Add Contact').click();
    });

    expect(useReducerSpy.mock.calls[1][0]).toEqual({
      type: types.CONTACT_ERROR,
      payload: errorMessage,
    });
  });
});