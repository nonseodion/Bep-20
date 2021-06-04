
import { ethers } from "hardhat";
import {expect}  from "chai";
import { Contract, BigNumber, Signer, utils } from "ethers";


let purposeToken: Contract;
let totalSupply: BigNumber;
let Alice: Signer, Bob: Signer, Charlie: Signer;
const amount = utils.formatUnits("1000", "wei");

const init = async function (){
  const PurposeToken = await ethers.getContractFactory("PurposeToken");
  purposeToken = await PurposeToken.deploy();
  totalSupply = await purposeToken.totalSupply();
  await purposeToken.deployed();
  [Alice, Bob, Charlie] = await ethers.getSigners();
}


describe("Purpose Token", function () {
  //const amount = utils.parseUnits("1000", 18);

  beforeEach(async function(){
    await init();
  })

  it("Checks total Supply", async function(){
    const arg = "100000000000000000000000000000000";
    expect(totalSupply).to.equal(arg);
  })

  it("Checks balance of deployer", async function(){
    const balance = await purposeToken.balanceOf(await Alice.getAddress());
    expect(balance).to.equal(totalSupply);
  })

  it("Checks balance of random address", async function(){
    const balance = await purposeToken.balanceOf(await Bob.getAddress());
    expect(balance).to.equal(0);
  })

  it("Sends an amount of token", async function(){
    const receiver = await Bob.getAddress();
    expect(() => purposeToken.transfer(receiver, amount))
      .to.changeTokenBalances(purposeToken, [Alice, Bob], [-amount, amount])
  })

  it("Trys to send more than owned balance", async function(){
    const receiver = await Alice.getAddress();
    purposeToken = purposeToken.connect(Bob);
    await expect(purposeToken.transfer(receiver, amount))
      .to.be.revertedWith("ERC20: transfer amount exceeds balance");
  })

  describe("Approve and Transferfrom", async function(){
    let approved: string;

    beforeEach(async function (){
      await init();
      approved = await Bob.getAddress();
      await purposeToken.approve(approved, amount);
    })

    it("Checks approval", async function (){
      const approval = await purposeToken.allowance(await Alice.getAddress(), approved);
      expect(approval).to.equal(amount);
    });
  
    it("Spends approved amount", async function (){
      const transferfrom = async () => {
        purposeToken = await purposeToken.connect(Bob);
        await purposeToken.transferFrom(
          await Alice.getAddress(), 
          await Charlie.getAddress(),
          amount
        );
      }
      expect(transferfrom)
        .to.changeTokenBalances(purposeToken, [Alice, Charlie], [-amount, amount]);
    });
  
    it("Trys to spend more than approved amount", async function(){
      const transferfrom = async () => {
        purposeToken = await purposeToken.connect(Bob);
        await purposeToken.transferFrom(
          await Alice.getAddress(), 
          await Charlie.getAddress(),
          BigNumber.from(amount).add(1)
        );
      }
      expect(transferfrom())
        .to.be.revertedWith("ERC20: transfer amount exceeds allowance")
    });
  
    it("Increases allowance", async function(){
      await purposeToken.increaseAllowance(approved, 1);
      const approval = await purposeToken.allowance(await Alice.getAddress(), approved);
      expect(approval).to.equal(BigNumber.from(amount).add(1));
    });
  
    it("Decreases allowance", async function(){
      await purposeToken.decreaseAllowance(approved, 1);
      const approval = await purposeToken.allowance(await Alice.getAddress(), approved);
      expect(approval).to.equal(BigNumber.from(amount).sub(1));
    });  
  })
})
