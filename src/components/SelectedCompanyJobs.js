import React from 'react';
import { Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery, gql } from '@apollo/client';
import { StyledText } from './StyledText';
import { StyledView } from './StyledView';
import { StyledImage } from './StyledImage';
import locationIcon from '../assets/location-icon.png';
import clockIcon from '../assets/clock-icon.png';

const COMPANIES_JOBS = gql`
  query CompaniesJobs {
    companies {
      name
      jobs {
        cities {
          name
        }
        commitment {
          title
        }
        description
        id
        remotes {
          name
        }
        title
      }
    }
  }
`;

export default function SelectedCompanyJobs({ route }) {
  const { loading, error, data } = useQuery(COMPANIES_JOBS);
  const { companyName } = route.params;
  let companyJobsData = null;

  if (loading) return <Text>Loading Company&apos;s jobs...</Text>;
  if (error) return <Text>Error :(. Check your internet connection and reload the App!</Text>;

  if (data) {
    const companyInfo = data.companies.filter((company) => {
      return company.name === companyName;
    });
    const [selectedCompany] = companyInfo;
    companyJobsData = selectedCompany.jobs;
  }

  const renderItem = ({ item }) => {
    const cities = item.cities.reduce((acc, val, idx) => {
      return idx === 0 ? `${val.name}` : `${acc}, ${val.name}`;
    }, '');

    const remote = item.remotes.reduce((acc, val) => {
      return cities.length !== 0 ? `${acc} / ${val.name}` : `${acc}${val.name}`;
    }, '');

    const commitment = item.commitment.title;

    return (
      <StyledView viewType="job">
        <StyledText textType="jobTitle">{item.title}</StyledText>
        <StyledView viewType="locationsRow">
          <StyledImage source={locationIcon} imgType="jobScreenIcon" />
          <StyledText>{cities}</StyledText>
          <StyledText textType="remote">{remote}</StyledText>
        </StyledView>
        <StyledView viewType="commitmentRow">
          <StyledImage source={clockIcon} imgType="jobScreenIcon" />
          <StyledText>{commitment}</StyledText>
        </StyledView>
      </StyledView>
    );
  };

  return (
    companyJobsData && (
      <FlatList data={companyJobsData} renderItem={renderItem} keyExtractor={(item) => item.id} />
    )
  );
}

SelectedCompanyJobs.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      companyName: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
