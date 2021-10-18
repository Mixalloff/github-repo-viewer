import { cleanup } from "@testing-library/react";
import axios, { AxiosResponse } from "axios";
import { act } from "react-dom/test-utils";
import { shallow } from "enzyme";
import RepositoriesPage from "../RepositoriesPage";
import { createMemoryHistory, createLocation } from 'history';
import { match } from 'react-router';
import '../../matchMedia.mock';
import enableHooks from 'jest-react-hooks-shallow';
import { withHooks } from 'jest-react-hooks-shallow';

// Enable useEffect and another hooks for 'shallow' render
enableHooks(jest);

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('antd/lib/grid/row', () =>
  jest.genMockFromModule('antd/lib/grid/row'),
);

describe('RepositoriesPage', () => {
  afterEach(() => {
    mockedAxios.get.mockReset();
    cleanup();
  });

  describe("when API call is successful", () => {
    it('should call backend with right arguments from router params', async () => {
      const usernameMock = 'testUser';
      const history = createMemoryHistory();
      const path = `/:username`;
      const match: match<{ username: string }> = {
          isExact: true,
          path,
          url: path.replace(':username', usernameMock),
          params: { username: usernameMock }
      };
      const location = createLocation(match.url);
      const props = { location, history, match };
      const mockRepositories: Partial<AxiosResponse<any>> = {
        data: [
          { id: 1, name: 'test1', language: 'Javascript' },
        ],
      };
      mockedAxios.get.mockResolvedValueOnce(mockRepositories);

      withHooks(async () => {
        const wrapper = shallow(
          <RepositoriesPage {...props} />
        );
  
        await act(() => new Promise(resolve => setTimeout(resolve, 0)));

        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`/users/${usernameMock}/repos`));
        expect(axios.get).toBeCalledTimes(1);
      });
    });
  });

});
