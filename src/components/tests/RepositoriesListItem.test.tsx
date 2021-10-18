import { cleanup } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { mount } from "enzyme";
import '../../matchMedia.mock';
import RepositoriesListItem from "../RepositoriesListItem";

describe('RepositoriesList', () => {
  afterEach(() => {
    cleanup();
  });

  it('should have correct title text and language', async () => {
    const mockItems: Partial<AxiosResponse<any>> = {
      data: {
        id: 1,
        name: 'Test1',
        language: 'Javascript',
      },
    };
    const wrapper = mount(<RepositoriesListItem item={mockItems.data} loading={false}/>);
    const titleText = wrapper.find('.ant-card-meta-title').text();
    const languageText = wrapper.find('.ant-card-meta-description').text();

    expect(titleText).toStrictEqual(mockItems.data.name);
    expect(languageText).toStrictEqual(mockItems.data.language);
  });
});
