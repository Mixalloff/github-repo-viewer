import { cleanup } from "@testing-library/react";
import { Alert, Button, Input } from "antd";
import axios, { AxiosResponse } from "axios";
import { act } from "react-dom/test-utils";
import MainPage from "../MainPage";
import { mount, ReactWrapper } from "enzyme";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const login = 'test';

let wrapper: ReactWrapper<JSX.Element>,
  inputField: ReactWrapper<any>,
  submitButton: ReactWrapper<any>;

describe('MainPage', () => {
  beforeEach(() => {
    wrapper = mount(<MainPage/>);
    inputField = wrapper.find(Input);
    submitButton = wrapper.find(Button);
  });

  afterEach(() => {
    mockedAxios.get.mockReset();
    cleanup();
  });

  describe("when API call is successful", () => {
    it('should call api with right arguments one time', async () => {
      const mockUser: Partial<AxiosResponse<any>> = {
        data: {
          login: 'test'
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockUser);

      inputField.simulate('change', { target: { value: login } });
      submitButton.simulate('click');

      // Avoiding 'act' warning
      await act(() => new Promise(resolve => setImmediate(resolve)));

      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`/users/${login}`));
      expect(axios.get).toBeCalledTimes(1);
    });
  });

  describe("when API call is failed", () => {
    it('should display an correct error alert', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Test error'
          },
        }
      };
      mockedAxios.get.mockRejectedValueOnce(mockError);

      inputField.simulate('change', { target: { value: login } });
      submitButton.simulate('click');

      // Awaiting for interface update and avoid 'act' warning
      await act(() => new Promise(resolve => setImmediate(resolve)));
      wrapper.update();

      const errorAlert = wrapper.find(Alert);
      const alertErrorText = errorAlert.find('.ant-alert-description').text();

      expect(alertErrorText).toStrictEqual(mockError.response.data.message);
    });
  });
});
