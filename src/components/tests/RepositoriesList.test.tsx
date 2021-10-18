import { cleanup } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { shallow } from "enzyme";
import RepositoriesList from "../RepositoriesList";
import '../../matchMedia.mock';
import RepositoriesListItem from "../RepositoriesListItem";

describe('RepositoriesList', () => {
  afterEach(() => {
    cleanup();
  });

  it('should have correct count of RepositoriesListItem and right props', async () => {
    const mockItems: Partial<AxiosResponse<any>> = {
      data: [
        { id: 1, name: 'Test1', language: 'Javascript' },
        { id: 2, name: 'Test2', language: 'Java' },
      ],
    };

    const wrapper = shallow(<RepositoriesList items={mockItems.data} onItemClick={jest.fn()}/>);
    const itemComponents = wrapper.find(RepositoriesListItem);
    const firstItemElement = itemComponents.at(0).getElement();

    expect(itemComponents.length).toStrictEqual(mockItems.data.length);
    expect(firstItemElement.props.item).toStrictEqual(mockItems.data[0]);
    expect(firstItemElement.props.loading).toStrictEqual(false);
  });
});
