require('dotenv').config();
const { Contract } = require('fabric-contract-api');
const nano = require('nano')(process.env.SYS_ADMIN_IDENTITY);

class AsueContract extends Contract {

    // Helper function to get current timestamp
    getCurrentTimestamp() {
        return new Date().toISOString();
    }

    // Helper function to verify sysAdmin
    _verifySysAdmin(ctx) {
        const identity = ctx.clientIdentity.getID();
        if (identity !== process.env.SYS_ADMIN_IDENTITY) {
            throw new Error('Permission denied. Only SysAdmin can perform this action.');
        }
    }

    async initLedger(ctx) {
        console.log(`[${this.getCurrentTimestamp()}] Initializing Asue Ledger`);

        try {
            const readyGroupsDB = nano.use('readygroups');
            const readyGroupsDoc = await readyGroupsDB.list({ include_docs: true });

            for (const row of readyGroupsDoc.rows) {
                const group = row.doc;
                await this.createGroup(ctx, group.groupId, group.lifetimeDuration, JSON.stringify(group.payoutSchedule), group.members);
                console.log(`[${this.getCurrentTimestamp()}] Group ${group.groupId} initialized`);
            }

        } catch (error) {
            console.error(`[${this.getCurrentTimestamp()}] Failed to initialize ledger: ${error}`);
            throw new Error(`Failed to initialize ledger: ${error}`);
        }
    }

    async createGroup(ctx, groupId, lifetimeDuration, payoutSchedule, members) {
        this._verifySysAdmin(ctx);

        if (!members) {
            throw new Error(`[${this.getCurrentTimestamp()}] Members not provided for group ${groupId}`);
        }
    
        // Create the group object
        const group = {
            id: groupId,
            members: members,
            currentCycle: 0,
            payouts: {},
            escrowWallet: {
                balance: 0,
                transactions: []
            },
            contributions: {},
            isPayoutPaused: false,
            lifetimeDuration: parseInt(lifetimeDuration),
            payoutSchedule: JSON.parse(payoutSchedule), 
            creationDate: this.getCurrentTimestamp()
        };
    
        await ctx.stub.putState(groupId, Buffer.from(JSON.stringify(group)));

        console.log(`[${this.getCurrentTimestamp()}] Group ${groupId} created at ${group.creationDate}`);
    
        return JSON.stringify(group);
    }

    async contribute(ctx, groupId, memberId, amount) {
        const groupAsBytes = await ctx.stub.getState(groupId);
        if (!groupAsBytes || groupAsBytes.length === 0) {
            throw new Error(`[${this.getCurrentTimestamp()}] Group ${groupId} does not exist`);
        }
        const group = JSON.parse(groupAsBytes.toString());
    
        // Add contribution to the group's contribution record
        if (!group.contributions[memberId]) {
            group.contributions[memberId] = 0;
        }
        group.contributions[memberId] += parseFloat(amount);
    
        // Update escrow wallet balance
        group.escrowWallet.balance += parseFloat(amount);
    
        await ctx.stub.putState(groupId, Buffer.from(JSON.stringify(group)));
        console.log(`[${this.getCurrentTimestamp()}] Member ${memberId} contributed ${amount} to Group ${groupId}`);
        return `Member ${memberId} contributed ${amount} to Group ${groupId}`;
    }

    async pausePayouts(ctx, groupId) {
        this._verifySysAdmin(ctx);

        const groupAsBytes = await ctx.stub.getState(groupId);
        if (!groupAsBytes || groupAsBytes.length === 0) {
            throw new Error(`[${this.getCurrentTimestamp()}] Group ${groupId} does not exist`);
        }
        const group = JSON.parse(groupAsBytes.toString());
        group.isPayoutPaused = true;
        await ctx.stub.putState(groupId, Buffer.from(JSON.stringify(group)));
        console.log(`[${this.getCurrentTimestamp()}] Payouts paused for Group ${groupId}`);
        return `Payouts paused for Group ${groupId}`;
    }

    async resumePayouts(ctx, groupId) {
        this._verifySysAdmin(ctx);

        const groupAsBytes = await ctx.stub.getState(groupId);
        if (!groupAsBytes || groupAsBytes.length === 0) {
            throw new Error(`[${this.getCurrentTimestamp()}] Group ${groupId} does not exist`);
        }
        const group = JSON.parse(groupAsBytes.toString());
        group.isPayoutPaused = false;
        await ctx.stub.putState(groupId, Buffer.from(JSON.stringify(group)));
        console.log(`[${this.getCurrentTimestamp()}] Payouts resumed for Group ${groupId}`);
        return `Payouts resumed for Group ${groupId}`;
    }

    async checkAndCloseGroup(ctx, groupId) {
        this._verifySysAdmin(ctx);

        const groupAsBytes = await ctx.stub.getState(groupId);
        if (!groupAsBytes || groupAsBytes.length === 0) {
            throw new Error(`[${this.getCurrentTimestamp()}] Group ${groupId} does not exist`);
        }
        const group = JSON.parse(groupAsBytes.toString());
        const currentTime = this.getCurrentTimestamp();
        if (new Date(currentTime) - new Date(group.creationDate) >= group.lifetimeDuration) {
            await ctx.stub.deleteState(groupId); // Remove the group from the ledger
            console.log(`[${this.getCurrentTimestamp()}] Group ${groupId} closed and removed after lifetime duration.`);
            return `Group ${groupId} closed and removed after lifetime duration.`;
        }
        return `Group ${groupId} is still active.`;
    }

    async updateAdminWallet(ctx, amount, groupId) {
        this._verifySysAdmin(ctx);

        const adminWalletDB = nano.use('adminwallet');
    
        const transaction = {
            type: 'admin_fee',
            amount: amount,
            groupId: groupId,
            timestamp: this.getCurrentTimestamp()
        };
    
        await adminWalletDB.insert(transaction);
        console.log(`[${this.getCurrentTimestamp()}] Admin wallet updated with amount ${amount} for group ${groupId}`);
    }
}

module.exports = AsueContract;
