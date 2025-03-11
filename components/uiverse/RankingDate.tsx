"use client";

import styled from "styled-components";

const RankingDate = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <h2>
          <span className="text-xl">24</span> <br /> Grudnia
        </h2>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 90px;
    height: 70px;
    background: #4f0c0c;
    position: relative;
    display: flex;
    place-content: center;
    place-items: center;
    overflow: hidden;
    border-radius: 10px;
  }

  .card h2 {
    z-index: 1;
    color: white;
    font-size: 1rem;
    text-align: center;
    font-weight: 500;
  }

  .card::before {
    content: "";
    position: absolute;
    width: 50px;
    background-image: linear-gradient(
      180deg,
      rgb(255, 255, 255),
      rgb(255, 255, 255)
    );
    height: 150%;
    animation: rotBGimg 5s linear infinite;
    transition: all 0.2s linear;
  }

  @keyframes rotBGimg {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .card::after {
    content: "";
    position: absolute;
    background: #4f0c0c;
    inset: 3px;
    border-radius: 10px;
  }
`;

export default RankingDate;
