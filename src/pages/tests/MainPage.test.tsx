import { cleanup } from "@testing-library/react";
import { Alert, Button, Input } from "antd";
import axios, { AxiosResponse } from "axios";
import { act,  renderIntoDocument } from "react-dom/test-utils";
import { GithubApiService } from "../../api/github-api.service";
import MainPage from "../MainPage";
import { mount } from "enzyme";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MainPage', () => {
  afterEach(() => {
    mockedAxios.get.mockReset();
    cleanup();
  });

  describe("when API call is successful", () => {
    it('should call api with right arguments one time', async () => {
      const githubApiService = new GithubApiService();
      const mockUser: Partial<AxiosResponse<any>> = {
        data: {
          login: 'test'
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockUser);
      const login = 'test';

      renderIntoDocument(<MainPage/>);
      const wrapper = mount(<MainPage/>);
      const inputField = wrapper.find(Input);
      const submitButton = wrapper.find(Button);
      inputField.simulate('change', { target: { value: login } });
      submitButton.simulate('click');

      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`/users/${login}`));
      expect(axios.get).toBeCalledTimes(1);

      mockedAxios.get.mockReset();
      // Avoiding 'act' warning
      await act(() => new Promise(resolve => setImmediate(resolve)));
    });
  });

  describe("when API call is failed", () => {
    it('should display an correct error alert', async () => {
      const githubApiService = new GithubApiService();
      const mockError = {
        response: {
          data: {
            message: 'Some error'
          },
        }
      };
      mockedAxios.get.mockRejectedValueOnce(mockError);
      const login = 'test';

      renderIntoDocument(<MainPage/>);
      const wrapper = mount(<MainPage/>);
      const inputField = wrapper.find(Input);
      const submitButton = wrapper.find(Button);

      act(() => {
        inputField.simulate('change', { target: { value: login } });
        submitButton.simulate('click');
      });

      // Awaiting for interface update and avoid 'act' warning
      await act(() => new Promise(resolve => setImmediate(resolve)));
      wrapper.update();

      const errorAlert = wrapper.find(Alert);
      const alertErrorText = errorAlert.find('.ant-alert-description').text();

      expect(alertErrorText).toStrictEqual(mockError.response.data.message);

      mockedAxios.get.mockReset();
    });
  });
});
